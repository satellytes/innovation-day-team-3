package database

import (
	"context"
	"fmt"
	"sync"
	"time"

	"sy-stripe-service/internal/models"
)

// InMemoryUserRepository implements UserRepository for dev/testing.
type InMemoryUserRepository struct {
	mu    sync.RWMutex
	users map[string]*models.User // key: StripeCustomerID
}

func (r *InMemoryUserRepository) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, user := range r.users {
		if user.ID.String() == id {
			return user, nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

func (r *InMemoryUserRepository) GetAllUsers(ctx context.Context) ([]*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	users := make([]*models.User, 0, len(r.users))
	for _, u := range r.users {
		users = append(users, u)
	}
	return users, nil
}

func NewInMemoryUserRepository() *InMemoryUserRepository {
	return &InMemoryUserRepository{
		users: make(map[string]*models.User),
	}
}

func (r *InMemoryUserRepository) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, exists := r.users[user.StripeCustomerID]; exists {
		return nil, fmt.Errorf("user already exists")
	}
	r.users[user.StripeCustomerID] = user
	return user, nil
}

func (r *InMemoryUserRepository) GetUserByStripeCustomerID(ctx context.Context, customerID string) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	user, exists := r.users[customerID]
	if !exists {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

// InMemorySubscriptionRepository implements SubscriptionRepository for dev/testing.
type InMemorySubscriptionRepository struct {
	mu             sync.RWMutex
	subscriptions  map[string]*models.Subscription // key: StripeSubscriptionID
}

func (r *InMemorySubscriptionRepository) GetSubscriptionByID(ctx context.Context, id string) (*models.Subscription, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, sub := range r.subscriptions {
		if sub.ID.String() == id {
			return sub, nil
		}
	}
	return nil, fmt.Errorf("subscription not found")
}

func NewInMemorySubscriptionRepository() *InMemorySubscriptionRepository {
	return &InMemorySubscriptionRepository{
		subscriptions: make(map[string]*models.Subscription),
	}
}

func (r *InMemorySubscriptionRepository) CreateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, exists := r.subscriptions[sub.StripeSubscriptionID]; exists {
		return nil, fmt.Errorf("subscription already exists")
	}
	r.subscriptions[sub.StripeSubscriptionID] = sub
	return sub, nil
}

func (r *InMemorySubscriptionRepository) GetSubscriptionByStripeSubscriptionID(ctx context.Context, subID string) (*models.Subscription, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	sub, exists := r.subscriptions[subID]
	if !exists {
		return nil, fmt.Errorf("subscription not found")
	}
	return sub, nil
}

func (r *InMemorySubscriptionRepository) UpdateSubscriptionStatus(ctx context.Context, subID string, status string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	sub, exists := r.subscriptions[subID]
	if !exists {
		return fmt.Errorf("subscription not found")
	}
	sub.Status = status
	sub.UpdatedAt = time.Now()
	return nil
}

func (r *InMemorySubscriptionRepository) UpdateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.subscriptions[sub.StripeSubscriptionID] = sub
	sub.UpdatedAt = time.Now()
	return sub, nil
}
