package app

import (
	"sy-stripe-service/internal/app/handlers"
	"sy-stripe-service/internal/app/services"
	"sy-stripe-service/internal/database"
	"github.com/gin-gonic/gin"
)

// SetupCheckoutRoutes wires up the checkout session handler with all dependencies
func SetupCheckoutRoutes(r *gin.Engine, db *database.DB, successURL, cancelURL string) {
	var userRepo database.UserRepository
	var subRepo database.SubscriptionRepository
	if db.Postgres != nil {
		userRepo = database.NewPostgresUserRepository(db.Postgres)
		subRepo = database.NewPostgresSubscriptionRepository(db.Postgres)
	} else if db.SQLite != nil {
		userRepo = database.NewSQLiteUserRepository(db.SQLite)
		subRepo = database.NewSQLiteSubscriptionRepository(db.SQLite)
	} else {
		userRepo = database.NewInMemoryUserRepository()
		subRepo = database.NewInMemorySubscriptionRepository()
	}
	userService := services.NewUserService(userRepo)
	subService := services.NewSubscriptionService(userRepo, subRepo)
	checkoutHandler := handlers.NewCheckoutHandler(subService, userService, successURL, cancelURL)
	userHandler := handlers.NewUserHandler(userService, subService)

	r.GET("/api/v1/checkout-session/:id", checkoutHandler.GetCheckoutSessionHandler)
	r.GET("/api/v1/customers/:id/details", userHandler.GetCustomerDetailsHandler)
}

