package services

import (
	"context"
	"time"
	"github.com/google/uuid"
	"sy-stripe-service/internal/database"
	"sy-stripe-service/internal/models"
)

type SubscriptionService struct {
	Repo database.SubscriptionRepository
	// StripeClient placeholder (add actual client when integrating Stripe)
}

func NewSubscriptionService(repo database.SubscriptionRepository) *SubscriptionService {
	return &SubscriptionService{Repo: repo}
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
	return s.Repo.CreateSubscription(ctx, sub)
}

func (s *SubscriptionService) CancelSubscription(ctx context.Context, subscriptionID string) error {
	// Placeholder: Implement Stripe cancellation logic later
	return nil
}

func (s *SubscriptionService) UpdateSubscriptionStatus(ctx context.Context, stripeSubscriptionID string, status string, currentPeriodEnd time.Time, cancelAtPeriodEnd bool) error {
	// Placeholder: Update status in DB and (later) Stripe
	return s.Repo.UpdateSubscriptionStatus(ctx, stripeSubscriptionID, status)
}

func (s *SubscriptionService) UpdateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error) {
	return s.Repo.UpdateSubscription(ctx, sub)
}
