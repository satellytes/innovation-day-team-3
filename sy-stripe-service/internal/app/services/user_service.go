package services

import (
	"context"
	"time"
	"github.com/google/uuid"
	"sy-stripe-service/internal/database"
	"sy-stripe-service/internal/models"
)

type UserService struct {
	Repo database.UserRepository
}

func NewUserService(repo database.UserRepository) *UserService {
	return &UserService{Repo: repo}
}

func (s *UserService) CreateUser(ctx context.Context, email string, stripeCustomerID string) (*models.User, error) {
	id := uuid.New()
	user := &models.User{
		ID: id,
		Email: email,
		StripeCustomerID: stripeCustomerID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	return s.Repo.CreateUser(ctx, user)
}
