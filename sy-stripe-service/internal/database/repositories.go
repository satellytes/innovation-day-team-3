package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"sy-stripe-service/internal/models"
)

// UserRepository defines DB operations for users.
type UserRepository interface {
	CreateUser(ctx context.Context, user *models.User) (*models.User, error)
	GetUserByStripeCustomerID(ctx context.Context, customerID string) (*models.User, error)
	GetUserByID(ctx context.Context, id string) (*models.User, error)
	GetAllUsers(ctx context.Context) ([]*models.User, error)
}

// SubscriptionRepository defines DB operations for subscriptions.
type SubscriptionRepository interface {
	CreateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error)
	GetSubscriptionByStripeSubscriptionID(ctx context.Context, subID string) (*models.Subscription, error)
	GetSubscriptionByID(ctx context.Context, id string) (*models.Subscription, error)
	UpdateSubscriptionStatus(ctx context.Context, subID string, status string) error
	UpdateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error)
}

func (r *PostgresUserRepository) GetAllUsers(ctx context.Context) ([]*models.User, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, stripe_customer_id, email, name, created_at, updated_at FROM users`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var users []*models.User
	for rows.Next() {
		var u models.User
		err := rows.Scan(&u.ID, &u.StripeCustomerID, &u.Email, &u.Name, &u.CreatedAt, &u.UpdatedAt)
		if err != nil {
			return nil, err
		}
		users = append(users, &u)
	}
	return users, nil
}

// PostgresUserRepository implements UserRepository.
type PostgresUserRepository struct {
	pool *pgxpool.Pool
}

func (r *PostgresUserRepository) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	query := `SELECT id, stripe_customer_id, email, name, created_at, updated_at FROM users WHERE id = $1`
	row := r.pool.QueryRow(ctx, query, id)
	var u models.User
	err := row.Scan(&u.ID, &u.StripeCustomerID, &u.Email, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	return &u, nil
}

func NewPostgresUserRepository(pool *pgxpool.Pool) *PostgresUserRepository {
	return &PostgresUserRepository{pool: pool}
}

func (r *PostgresUserRepository) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	query := `INSERT INTO users (id, stripe_customer_id, email, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, stripe_customer_id, email, name, created_at, updated_at`
	row := r.pool.QueryRow(ctx, query, user.ID, user.StripeCustomerID, user.Email, user.Name, user.CreatedAt, user.UpdatedAt)
	var u models.User
	err := row.Scan(&u.ID, &u.StripeCustomerID, &u.Email, &u.Name, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to insert user: %w", err)
	}
	return &u, nil
}

func (r *PostgresUserRepository) GetUserByStripeCustomerID(ctx context.Context, customerID string) (*models.User, error) {
	query := `SELECT id, stripe_customer_id, email, name, created_at, updated_at FROM users WHERE stripe_customer_id = $1`
	row := r.pool.QueryRow(ctx, query, customerID)
	var u models.User
	err := row.Scan(&u.ID, &u.StripeCustomerID, &u.Email, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	return &u, nil
}

// PostgresSubscriptionRepository implements SubscriptionRepository.
type PostgresSubscriptionRepository struct {
	pool *pgxpool.Pool
}

func (r *PostgresSubscriptionRepository) GetSubscriptionByID(ctx context.Context, id string) (*models.Subscription, error) {
	query := `SELECT id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, created_at, updated_at FROM subscriptions WHERE id = $1`
	row := r.pool.QueryRow(ctx, query, id)
	var s models.Subscription
	err := row.Scan(&s.ID, &s.UserID, &s.StripeSubscriptionID, &s.StripePriceID, &s.Status, &s.CurrentPeriodStart, &s.CurrentPeriodEnd, &s.CreatedAt, &s.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("subscription not found: %w", err)
	}
	return &s, nil
}

func NewPostgresSubscriptionRepository(pool *pgxpool.Pool) *PostgresSubscriptionRepository {
	return &PostgresSubscriptionRepository{pool: pool}
}

func (r *PostgresSubscriptionRepository) CreateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error) {
	query := `INSERT INTO subscriptions (id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, created_at, updated_at`
	row := r.pool.QueryRow(ctx, query, sub.ID, sub.UserID, sub.StripeSubscriptionID, sub.StripePriceID, sub.Status, sub.CurrentPeriodStart, sub.CurrentPeriodEnd, sub.CreatedAt, sub.UpdatedAt)
	var s models.Subscription
	err := row.Scan(&s.ID, &s.UserID, &s.StripeSubscriptionID, &s.StripePriceID, &s.Status, &s.CurrentPeriodStart, &s.CurrentPeriodEnd, &s.CreatedAt, &s.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to insert subscription: %w", err)
	}
	return &s, nil
}

func (r *PostgresSubscriptionRepository) GetSubscriptionByStripeSubscriptionID(ctx context.Context, subID string) (*models.Subscription, error) {
	query := `SELECT id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, created_at, updated_at FROM subscriptions WHERE stripe_subscription_id = $1`
	row := r.pool.QueryRow(ctx, query, subID)
	var s models.Subscription
	err := row.Scan(&s.ID, &s.UserID, &s.StripeSubscriptionID, &s.StripePriceID, &s.Status, &s.CurrentPeriodStart, &s.CurrentPeriodEnd, &s.CreatedAt, &s.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("subscription not found: %w", err)
	}
	return &s, nil
}

func (r *PostgresSubscriptionRepository) UpdateSubscriptionStatus(ctx context.Context, subID string, status string) error {
	query := `UPDATE subscriptions SET status = $1, updated_at = $2 WHERE stripe_subscription_id = $3`
	_, err := r.pool.Exec(ctx, query, status, time.Now(), subID)
	if err != nil {
		return fmt.Errorf("failed to update subscription status: %w", err)
	}
	return nil
}

func (r *PostgresSubscriptionRepository) UpdateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error) {
	query := `UPDATE subscriptions SET status = $1, current_period_start = $2, current_period_end = $3, updated_at = $4 WHERE stripe_subscription_id = $5 RETURNING id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, created_at, updated_at`
	row := r.pool.QueryRow(ctx, query, sub.Status, sub.CurrentPeriodStart, sub.CurrentPeriodEnd, sub.UpdatedAt, sub.StripeSubscriptionID)
	var s models.Subscription
	err := row.Scan(&s.ID, &s.UserID, &s.StripeSubscriptionID, &s.StripePriceID, &s.Status, &s.CurrentPeriodStart, &s.CurrentPeriodEnd, &s.CreatedAt, &s.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to update subscription: %w", err)
	}
	return &s, nil
}
