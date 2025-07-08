package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	"sy-stripe-service/internal/app/handlers"
	"sy-stripe-service/internal/app/services"
	"sy-stripe-service/internal/config"
	"sy-stripe-service/internal/database"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading configuration: %v", err)
	}

	// Initialize database connection
	db, err := database.NewDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Apply migrations for SQLite in-memory database
	if cfg.DatabaseURL == "file::memory:?cache=shared" {
		err = database.ApplyMigrations(db.SQLite, "./migrations")
		if err != nil {
			log.Fatalf("Failed to apply migrations: %v", err)
		}
	}

	// Initialize Stripe
	stripe.Key = cfg.StripeSecretKey

	// Initialize Gin router
	r := gin.Default()

	// Register health check route
	healthHandler := handlers.NewHealthHandler()
	r.GET("/health", healthHandler.HealthCheckHandler)

	// Initialize repositories and services
	var userRepo interface{}
	var subRepo interface{}
	if db.Postgres != nil {
		userRepo = database.NewPostgresUserRepository(db.Postgres)
		subRepo = database.NewPostgresSubscriptionRepository(db.Postgres)
	} else {
		userRepo = database.NewInMemoryUserRepository()
		subRepo = database.NewInMemorySubscriptionRepository()
	}
	userService := services.NewUserService(userRepo.(database.UserRepository))
	subService := services.NewSubscriptionService(subRepo.(database.SubscriptionRepository))
	stripeService := handlers.NewStripeService()
	stripeHandlers := handlers.NewStripeHandlers(stripeService, userService, subService)

	v1 := r.Group("/api/v1")
	{
		v1.POST("/customers/create", stripeHandlers.CreateCustomerHandler)
		v1.POST("/subscriptions/create", stripeHandlers.CreateSubscriptionHandler)
		v1.GET("/products", stripeHandlers.GetProductsHandler)
	}

	// Start HTTP server
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.ServerPort),
		Handler: r,
	}

	// Goroutine to start the server
	go func() {
		log.Printf("Server is running on port %s\n", cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server exiting")
}
