package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds the application configuration
type Config struct {
	ServerPort      string
	DatabaseURL     string
	StripeSecretKey string
	AppSuccessURL   string
	AppCancelURL    string
}

// LoadConfig loads configuration from environment variables or .env file
func LoadConfig() (*Config, error) {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found, loading from environment variables.")
	}

	cfg := &Config{
		ServerPort:      getEnv("SERVER_PORT", "8080"),
		DatabaseURL:     os.Getenv("DATABASE_URL"),
		StripeSecretKey: os.Getenv("STRIPE_SECRET_KEY"),
		AppSuccessURL:   os.Getenv("APP_SUCCESS_URL"),
		AppCancelURL:    os.Getenv("APP_CANCEL_URL"),
	}

	// Basic validation
	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL not set in environment")
	}
	if cfg.StripeSecretKey == "" {
		return nil, fmt.Errorf("STRIPE_SECRET_KEY not set in environment")
	}

	return cfg, nil
}

// getEnv retrieves an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
