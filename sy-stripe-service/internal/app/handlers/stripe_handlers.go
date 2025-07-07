package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/customer"
	"github.com/stripe/stripe-go/v72/product"
	"github.com/stripe/stripe-go/v72/sub"
)

// StripeService defines the interface for Stripe operations.
type StripeService interface {
	CreateCustomer(email, name string) (*stripe.Customer, error)
	CreateSubscription(customerID, priceID string) (*stripe.Subscription, error)
	GetProducts() ([]*stripe.Product, error)
}

// stripeServiceImpl implements StripeService using the Stripe Go SDK.
type stripeServiceImpl struct{}

// NewStripeService creates a new StripeService instance.
func NewStripeService() StripeService {
	return &stripeServiceImpl{}
}

// CreateCustomer creates a new Stripe customer.
func (s *stripeServiceImpl) CreateCustomer(email, name string) (*stripe.Customer, error) {
	params := &stripe.CustomerParams{
		Email: stripe.String(email),
		Name:  stripe.String(name),
	}
	return customer.New(params)
}

// CreateSubscription creates a new Stripe subscription.
func (s *stripeServiceImpl) CreateSubscription(customerID, priceID string) (*stripe.Subscription, error) {
	params := &stripe.SubscriptionParams{
		Customer: stripe.String(customerID),
		Items: []*stripe.SubscriptionItemsParams{
			{
				Price: stripe.String(priceID),
			},
		},
	}
	return sub.New(params)
}

// GetProducts retrieves a list of Stripe products.
func (s *stripeServiceImpl) GetProducts() ([]*stripe.Product, error) {
	params := &stripe.ProductListParams{}
	i := product.List(params)
	var products []*stripe.Product
	for i.Next() {
		products = append(products, i.Product())
	}
	return products, nil
}

// CreateCustomerRequest defines the request body for creating a customer.
type CreateCustomerRequest struct {
	Email string `json:"email" binding:"required,email"`
	Name  string `json:"name" binding:"required"`
}

// CreateSubscriptionRequest defines the request body for creating a subscription.
type CreateSubscriptionRequest struct {
	CustomerID string `json:"customer_id" binding:"required"`
	PriceID    string `json:"price_id" binding:"required"`
}

// NewStripeHandlers creates a new instance of StripeHandlers.
func NewStripeHandlers(stripeService StripeService) *StripeHandlers {
	return &StripeHandlers{stripeService: stripeService}
}

// StripeHandlers holds the Stripe service dependency.
type StripeHandlers struct {
	stripeService StripeService
}

// CreateCustomerHandler handles the creation of a new Stripe customer.
func (h *StripeHandlers) CreateCustomerHandler(c *gin.Context) {
	var req CreateCustomerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	customer, err := h.stripeService.CreateCustomer(req.Email, req.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create customer: %v", err)})
		return
	}

	c.JSON(http.StatusOK, customer)
}

// CreateSubscriptionHandler handles the creation of a new Stripe subscription.
func (h *StripeHandlers) CreateSubscriptionHandler(c *gin.Context) {
	var req CreateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	subscription, err := h.stripeService.CreateSubscription(req.CustomerID, req.PriceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create subscription: %v", err)})
		return
	}

	c.JSON(http.StatusOK, subscription)
}

// GetProductsHandler handles retrieving a list of Stripe products.
func (h *StripeHandlers) GetProductsHandler(c *gin.Context) {
	products, err := h.stripeService.GetProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to retrieve products: %v", err)})
		return
	}

	c.JSON(http.StatusOK, products)
}
