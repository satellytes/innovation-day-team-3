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
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer db.Close()

	// Initialize Gin router
	r := gin.Default()

	// Initialize Stripe
	stripe.Key = cfg.StripeSecretKey

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler()
	stripeService := handlers.NewStripeService()
	stripeHandlers := handlers.NewStripeHandlers(stripeService)

	// Register routes
	r.GET("/health", healthHandler.HealthCheckHandler)

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
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	log.Printf("Server is running on port %s", cfg.ServerPort)

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
