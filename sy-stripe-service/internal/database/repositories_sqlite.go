package database

import (
	"context"
	"database/sql"
	"fmt"
	"sy-stripe-service/internal/models"
	"time"
)

// parseAnyTime tries multiple layouts for SQLite time fields
func parseAnyTime(s string) (time.Time, error) {
	layouts := []string{
		time.RFC3339,
		"2006-01-02 15:04:05.999999-07:00",
		"2006-01-02 15:04:05-07:00",
	}
	var t time.Time
	var err error
	for _, layout := range layouts {
		t, err = time.Parse(layout, s)
		if err == nil {
			return t, nil
		}
	}
	return t, err
}

type SQLiteUserRepository struct {
	db *sql.DB
}

func (r *SQLiteUserRepository) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	query := `SELECT id, stripe_customer_id, email, name, created_at, updated_at FROM users WHERE id = ?`
	row := r.db.QueryRowContext(ctx, query, id)
	var u models.User
	var createdAtStr, updatedAtStr string
	err := row.Scan(&u.ID, &u.StripeCustomerID, &u.Email, &u.Name, &createdAtStr, &updatedAtStr)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	u.CreatedAt, err = parseAnyTime(createdAtStr)
	if err != nil {
		return nil, fmt.Errorf("parse created_at: %w", err)
	}
	u.UpdatedAt, err = parseAnyTime(updatedAtStr)
	if err != nil {
		return nil, fmt.Errorf("parse updated_at: %w", err)
	}
	return &u, nil
}

func NewSQLiteUserRepository(db *sql.DB) *SQLiteUserRepository {
	return &SQLiteUserRepository{db: db}
}

func (r *SQLiteUserRepository) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	query := `INSERT INTO users (id, stripe_customer_id, email, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := r.db.ExecContext(ctx, query, user.ID, user.StripeCustomerID, user.Email, user.Name, user.CreatedAt, user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to insert user: %w", err)
	}
	return user, nil
}

func (r *SQLiteUserRepository) GetUserByStripeCustomerID(ctx context.Context, customerID string) (*models.User, error) {
	query := `SELECT id, stripe_customer_id, email, name, created_at, updated_at FROM users WHERE stripe_customer_id = ?`
	row := r.db.QueryRowContext(ctx, query, customerID)
	var u models.User
	var createdAtStr, updatedAtStr string
	err := row.Scan(&u.ID, &u.StripeCustomerID, &u.Email, &u.Name, &createdAtStr, &updatedAtStr)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	u.CreatedAt, err = parseAnyTime(createdAtStr)
	if err != nil {
		return nil, fmt.Errorf("parse created_at: %w", err)
	}
	u.UpdatedAt, err = parseAnyTime(updatedAtStr)
	if err != nil {
		return nil, fmt.Errorf("parse updated_at: %w", err)
	}
	return &u, nil
}

func (r *SQLiteUserRepository) GetAllUsers(ctx context.Context) ([]*models.User, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, stripe_customer_id, email, name, created_at, updated_at FROM users`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var users []*models.User
	for rows.Next() {
		var u models.User
		var createdAtStr, updatedAtStr string
		err := rows.Scan(&u.ID, &u.StripeCustomerID, &u.Email, &u.Name, &createdAtStr, &updatedAtStr)
		if err != nil {
			return nil, err
		}
		u.CreatedAt, err = parseAnyTime(createdAtStr)
		if err != nil {
			return nil, fmt.Errorf("parse created_at: %w", err)
		}
		u.UpdatedAt, err = parseAnyTime(updatedAtStr)
		if err != nil {
			return nil, fmt.Errorf("parse updated_at: %w", err)
		}
		users = append(users, &u)
	}
	return users, nil
}

type SQLiteSubscriptionRepository struct {
	db *sql.DB
}

func (r *SQLiteSubscriptionRepository) GetSubscriptionByID(ctx context.Context, id string) (*models.Subscription, error) {
	query := `SELECT id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, created_at, updated_at FROM subscriptions WHERE id = ?`
	row := r.db.QueryRowContext(ctx, query, id)
	var s models.Subscription
	var currentPeriodStartStr, currentPeriodEndStr, createdAtStr, updatedAtStr string
	err := row.Scan(&s.ID, &s.UserID, &s.StripeSubscriptionID, &s.StripePriceID, &s.Status, &currentPeriodStartStr, &currentPeriodEndStr, &createdAtStr, &updatedAtStr)
	if err != nil {
		return nil, fmt.Errorf("subscription not found: %w", err)
	}
	s.CurrentPeriodStart, err = parseAnyTime(currentPeriodStartStr)
	if err != nil {
		return nil, fmt.Errorf("parse current_period_start: %w", err)
	}
	s.CurrentPeriodEnd, err = parseAnyTime(currentPeriodEndStr)
	if err != nil {
		return nil, fmt.Errorf("parse current_period_end: %w", err)
	}
	s.CreatedAt, err = parseAnyTime(createdAtStr)
	if err != nil {
		return nil, fmt.Errorf("parse created_at: %w", err)
	}
	s.UpdatedAt, err = parseAnyTime(updatedAtStr)
	if err != nil {
		return nil, fmt.Errorf("parse updated_at: %w", err)
	}
	return &s, nil
}

func NewSQLiteSubscriptionRepository(db *sql.DB) *SQLiteSubscriptionRepository {
	return &SQLiteSubscriptionRepository{db: db}
}

func (r *SQLiteSubscriptionRepository) CreateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error) {
	query := `INSERT INTO subscriptions (id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := r.db.ExecContext(ctx, query, sub.ID, sub.UserID, sub.StripeSubscriptionID, sub.StripePriceID, sub.Status, sub.CurrentPeriodStart, sub.CurrentPeriodEnd, sub.CreatedAt, sub.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to insert subscription: %w", err)
	}
	return sub, nil
}

func (r *SQLiteSubscriptionRepository) GetSubscriptionByStripeSubscriptionID(ctx context.Context, subID string) (*models.Subscription, error) {
	query := `SELECT id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, created_at, updated_at FROM subscriptions WHERE stripe_subscription_id = ?`
	row := r.db.QueryRowContext(ctx, query, subID)
	var s models.Subscription
	var currentPeriodStartStr, currentPeriodEndStr, createdAtStr, updatedAtStr string
	err := row.Scan(&s.ID, &s.UserID, &s.StripeSubscriptionID, &s.StripePriceID, &s.Status, &currentPeriodStartStr, &currentPeriodEndStr, &createdAtStr, &updatedAtStr)
	if err != nil {
		return nil, fmt.Errorf("subscription not found: %w", err)
	}
	s.CurrentPeriodStart, err = parseAnyTime(currentPeriodStartStr)
	if err != nil {
		return nil, fmt.Errorf("parse current_period_start: %w", err)
	}
	s.CurrentPeriodEnd, err = parseAnyTime(currentPeriodEndStr)
	if err != nil {
		return nil, fmt.Errorf("parse current_period_end: %w", err)
	}
	s.CreatedAt, err = parseAnyTime(createdAtStr)
	if err != nil {
		return nil, fmt.Errorf("parse created_at: %w", err)
	}
	s.UpdatedAt, err = parseAnyTime(updatedAtStr)
	if err != nil {
		return nil, fmt.Errorf("parse updated_at: %w", err)
	}
	return &s, nil
}

func (r *SQLiteSubscriptionRepository) UpdateSubscriptionStatus(ctx context.Context, subID string, status string) error {
	query := `UPDATE subscriptions SET status = ?, updated_at = ? WHERE stripe_subscription_id = ?`
	updatedAt := time.Now().Format(time.RFC3339)
	_, err := r.db.ExecContext(ctx, query, status, updatedAt, subID)
	if err != nil {
		return fmt.Errorf("failed to update subscription status: %w", err)
	}
	return nil
}

func (r *SQLiteSubscriptionRepository) UpdateSubscription(ctx context.Context, sub *models.Subscription) (*models.Subscription, error) {
	query := `UPDATE subscriptions SET status = ?, current_period_start = ?, current_period_end = ?, updated_at = ? WHERE stripe_subscription_id = ?`
	_, err := r.db.ExecContext(ctx, query, sub.Status, sub.CurrentPeriodStart, sub.CurrentPeriodEnd, sub.UpdatedAt, sub.StripeSubscriptionID)
	if err != nil {
		return nil, fmt.Errorf("failed to update subscription: %w", err)
	}
	return sub, nil
}

func (r *SQLiteSubscriptionRepository) GetAllSubscriptions(ctx context.Context) ([]*models.Subscription, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end, created_at, updated_at FROM subscriptions`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var subs []*models.Subscription
	for rows.Next() {
		var s models.Subscription
		var currentPeriodStartStr, currentPeriodEndStr, createdAtStr, updatedAtStr string
		err := rows.Scan(&s.ID, &s.UserID, &s.StripeSubscriptionID, &s.StripePriceID, &s.Status, &currentPeriodStartStr, &currentPeriodEndStr, &createdAtStr, &updatedAtStr)
		if err != nil {
			return nil, err
		}
		s.CurrentPeriodStart, err = parseAnyTime(currentPeriodStartStr)
		if err != nil {
			return nil, fmt.Errorf("parse current_period_start: %w", err)
		}
		s.CurrentPeriodEnd, err = parseAnyTime(currentPeriodEndStr)
		if err != nil {
			return nil, fmt.Errorf("parse current_period_end: %w", err)
		}
		s.CreatedAt, err = parseAnyTime(createdAtStr)
		if err != nil {
			return nil, fmt.Errorf("parse created_at: %w", err)
		}
		s.UpdatedAt, err = parseAnyTime(updatedAtStr)
		if err != nil {
			return nil, fmt.Errorf("parse updated_at: %w", err)
		}
		subs = append(subs, &s)
	}
	return subs, nil
}
