package services

import (
	"context"
	"os"
	"time"
	"fmt"
	"log"
	"github.com/google/uuid"
	"sy-stripe-service/internal/database"
	"sy-stripe-service/internal/models"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
	subpkg "github.com/stripe/stripe-go/v72/sub"
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
	log.Printf("[CancelSubscription] Called for subscriptionID: %s", subscriptionID)
	sub, err := s.SubRepo.GetSubscriptionByID(ctx, subscriptionID)
	if err != nil {
		log.Printf("[CancelSubscription] Not found by internal ID, trying StripeSubscriptionID: %v", err)
		sub, err = s.SubRepo.GetSubscriptionByStripeSubscriptionID(ctx, subscriptionID)
		if err != nil {
			log.Printf("[CancelSubscription] Error fetching subscription by StripeSubscriptionID: %v", err)
			// Try to cancel directly on Stripe as fallback
			log.Printf("[CancelSubscription] WARNING: Subscription not found in DB, attempting Stripe-only cancel for: %s", subscriptionID)
			stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
			_, stripeErr := subpkg.Cancel(subscriptionID, &stripe.SubscriptionCancelParams{})
			if stripeErr != nil {
				log.Printf("[CancelSubscription] Stripe direct cancel error: %v", stripeErr)
				return stripeErr
			}
			log.Printf("[CancelSubscription] Stripe cancel succeeded for orphaned subscription: %s", subscriptionID)
			return nil
		}
	}
	log.Printf("[CancelSubscription] Subscription loaded: %+v", sub)
	stripeSubID := sub.StripeSubscriptionID
	if stripeSubID == "" {
		log.Printf("[CancelSubscription] No StripeSubscriptionID, marking as canceled in DB only.")
		return s.SubRepo.UpdateSubscriptionStatus(ctx, sub.ID.String(), "canceled")
	}
	// Cancel on Stripe
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
	log.Printf("[CancelSubscription] Canceling on Stripe: %s", stripeSubID)
	_, err = subpkg.Cancel(stripeSubID, &stripe.SubscriptionCancelParams{})
	if err != nil {
		log.Printf("[CancelSubscription] ERROR: Stripe cancel failed, NOT updating DB. Error: %v", err)
		return err // Do not update DB if Stripe cancel fails
	}
	log.Printf("[CancelSubscription] Stripe cancel success, updating DB for %s", stripeSubID)
	return s.SubRepo.UpdateSubscriptionStatus(ctx, stripeSubID, "canceled")
}


func (s *SubscriptionService) UpdateSubscriptionStatus(ctx context.Context, stripeSubscriptionID string, status string, currentPeriodEnd time.Time, cancelAtPeriodEnd bool) error {
	// Placeholder: Update status in DB and (later) Stripe
	return s.SubRepo.UpdateSubscriptionStatus(ctx, stripeSubscriptionID, status)
}

// GetSubscriptionByID retrieves a subscription by its internal UUID
func (s *SubscriptionService) GetSubscriptionByID(ctx context.Context, id string) (*models.Subscription, error) {
	return s.SubRepo.GetSubscriptionByID(ctx, id)
}

// GetLatestSubscriptionByUserID retrieves the latest subscription for a user
func (s *SubscriptionService) GetLatestSubscriptionByUserID(ctx context.Context, userID string) (*models.Subscription, error) {
	return s.SubRepo.GetLatestSubscriptionByUserID(ctx, userID)
}

func (s *SubscriptionService) UpdateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error) {
	return s.SubRepo.UpdateSubscription(ctx, sub)
}

// CreateCheckoutSession creates a Stripe Checkout Session for a subscription.
func (s *SubscriptionService) CreateCheckoutSession(priceID string, userID *uuid.UUID, customerId, successURL, cancelURL string) (*stripe.CheckoutSession, error) {
	// Cancel the user's active subscription before creating a new one (plan change)
	if userID != nil {
		// Find latest subscription for user
		latestSub, err := s.GetLatestSubscriptionByUserID(context.Background(), userID.String())
		if err == nil && latestSub != nil && latestSub.StripeSubscriptionID != "" && latestSub.Status != "canceled" {
			cancelErr := s.CancelSubscription(context.Background(), latestSub.StripeSubscriptionID)
			if cancelErr != nil {
				return nil, fmt.Errorf("failed to cancel old subscription: %w", cancelErr)
			}
		}
	}
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

	// Prefer explicit Stripe customerId if provided
	if customerId != "" {
		params.Customer = stripe.String(customerId)
	} else if userID != nil {
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
