package models

import "time"

// Define your application's data models here.
// Examples:

// User represents a user in the system
type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	StripeCustomerID string `json:"stripe_customer_id"`
	CreatedAt time.Time `json:"created_at"`
}

// Subscription represents a user's subscription
type Subscription struct {
	ID        string `json:"id"`
	UserID    string `json:"user_id"`
	StripeSubscriptionID string `json:"stripe_subscription_id"`
	PlanID    string `json:"plan_id"`
	Status    string `json:"status"`
	CurrentPeriodEnd time.Time `json:"current_period_end"`
	CreatedAt time.Time `json:"created_at"`
}

// Add other models as needed, e.g., Product, Price, Invoice, etc.
