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

// Add other models as needed, e.g., Product, Price, Invoice, etc.
