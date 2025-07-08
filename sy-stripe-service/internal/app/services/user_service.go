package services

import (
	"context"
	"fmt"
	"time"
	"github.com/google/uuid"
	"sy-stripe-service/internal/database"
	"sy-stripe-service/internal/models"
)

type UserService struct {
	Repo database.UserRepository
}

// GetUserByID retrieves a user by internal UUID
func (s *UserService) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	return s.Repo.GetUserByID(ctx, id)
}

func (s *UserService) GetAllUsers(ctx context.Context) ([]*models.User, error) {
	type allUserRepo interface {
		GetAllUsers(ctx context.Context) ([]*models.User, error)
	}
	repo, ok := s.Repo.(allUserRepo)
	if !ok {
		return nil, fmt.Errorf("repository does not support GetAllUsers")
	}
	return repo.GetAllUsers(ctx)
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
