package models

import (
	"time"

	"github.com/google/uuid"
)

// Define your application's data models here.
// Examples:

// User represents a user in the system.
type User struct {
	ID             uuid.UUID `json:"id" db:"id"`
	StripeCustomerID string    `json:"stripe_customer_id" db:"stripe_customer_id"`
	Email          string    `json:"email" db:"email"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
}

// Subscription represents a user's subscription.
type Subscription struct {
	ID                 uuid.UUID `json:"id" db:"id"`
	UserID             uuid.UUID `json:"user_id" db:"user_id"`
	StripeSubscriptionID string    `json:"stripe_subscription_id" db:"stripe_subscription_id"`
	StripePriceID      string    `json:"stripe_price_id" db:"stripe_price_id"`
	Status             string    `json:"status" db:"status"`
	CurrentPeriodStart time.Time `json:"current_period_start" db:"current_period_start"`
	CurrentPeriodEnd   time.Time `json:"current_period_end" db:"current_period_end"`
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time `json:"updated_at" db:"updated_at"`
}

// PriceResponse represents a Stripe price in the API response.
type PriceResponse struct {
	ID        string  `json:"id"`
	Nickname  string  `json:"nickname"`
	UnitAmount int64   `json:"unit_amount"`
	Currency  string  `json:"currency"`
	Interval  string  `json:"interval"`
	Created   int64   `json:"created"`
}

// ProductResponse represents a Stripe product with nested prices.
type ProductResponse struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Active      bool            `json:"active"`
	Prices      []PriceResponse `json:"prices"`
}

// Add other models as needed, e.g., Product, Price, Invoice, etc.
