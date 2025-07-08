package services

import (
	"context"
	"time"
	"github.com/google/uuid"
	"sy-stripe-service/internal/database"
	"sy-stripe-service/internal/models"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
)


type SubscriptionService struct {
	UserRepo database.UserRepository
	SubRepo  database.SubscriptionRepository
}

func NewSubscriptionService(userRepo database.UserRepository, subRepo database.SubscriptionRepository) *SubscriptionService {
	return &SubscriptionService{UserRepo: userRepo, SubRepo: subRepo}
}

func (s *SubscriptionService) CreateSubscription(ctx context.Context, userID string, priceID string) (*models.Subscription, error) {
	id := uuid.New()
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, err
	}
	sub := &models.Subscription{
		ID: id,
		UserID: uid,
		StripePriceID: priceID,
		Status: "created",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	return s.SubRepo.CreateSubscription(ctx, sub)
}

func (s *SubscriptionService) CancelSubscription(ctx context.Context, subscriptionID string) error {
	// TODO: Call Stripe API to cancel subscription (MVP: skip or mock)
	// Update status in our database
	return s.SubRepo.UpdateSubscriptionStatus(ctx, subscriptionID, "canceled")
}

func (s *SubscriptionService) UpdateSubscriptionStatus(ctx context.Context, stripeSubscriptionID string, status string, currentPeriodEnd time.Time, cancelAtPeriodEnd bool) error {
	// Placeholder: Update status in DB and (later) Stripe
	return s.SubRepo.UpdateSubscriptionStatus(ctx, stripeSubscriptionID, status)
}

// GetSubscriptionByID retrieves a subscription by its internal UUID
func (s *SubscriptionService) GetSubscriptionByID(ctx context.Context, id string) (*models.Subscription, error) {
	return s.SubRepo.GetSubscriptionByID(ctx, id)
}

func (s *SubscriptionService) UpdateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error) {
	return s.SubRepo.UpdateSubscription(ctx, sub)
}

// CreateCheckoutSession creates a Stripe Checkout Session for a subscription.
func (s *SubscriptionService) CreateCheckoutSession(priceID string, userID *uuid.UUID, successURL, cancelURL string) (*stripe.CheckoutSession, error) {
	params := &stripe.CheckoutSessionParams{
		Mode: stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		SuccessURL: stripe.String(successURL),
		CancelURL:  stripe.String(cancelURL),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceID),
				Quantity: stripe.Int64(1),
			},
		},
	}

	// Add user/customer if userID provided
	if userID != nil {
		user, err := s.UserRepo.GetUserByStripeCustomerID(context.Background(), userID.String())
		if err == nil && user.StripeCustomerID != "" {
			params.Customer = stripe.String(user.StripeCustomerID)
		}
		if params.Metadata == nil {
			params.Metadata = make(map[string]string)
		}
		params.Metadata["user_id"] = userID.String()
	}

	sess, err := session.New(params)
	if err != nil {
		return nil, err
	}
	return sess, nil
}
