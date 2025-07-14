package handlers

import (
	"net/http"
	"os"
	"time"

	"sy-stripe-service/internal/app/services"
	"sy-stripe-service/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/sub"
	"github.com/stripe/stripe-go/v72/price"
)



type UserHandler struct {
	Service *services.UserService
	SubscriptionService *services.SubscriptionService
}

func NewUserHandler(service *services.UserService, subscriptionService *services.SubscriptionService) *UserHandler {
	return &UserHandler{Service: service, SubscriptionService: subscriptionService}
}

// GetAllUsersHandler returns all users in the database.
func (h *UserHandler) GetAllUsersHandler(c *gin.Context) {
	users, err := h.Service.GetAllUsers(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

// GetUserByIDHandler returns a user by internal UUID
func (h *UserHandler) GetUserByIDHandler(c *gin.Context) {
	id := c.Param("id")
	user, err := h.Service.GetUserByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// GetCustomerDetailsHandler returns user and latest subscription by user ID
func (h *UserHandler) GetCustomerDetailsHandler(c *gin.Context) {
	id := c.Param("id")
	user, err := h.Service.GetUserByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	subscription, subErr := h.SubscriptionService.GetLatestSubscriptionByUserID(c.Request.Context(), id)
	if subErr != nil || subscription == nil {
		// Fallback: fetch from Stripe if not found in DB
		stripeCustomerID := user.StripeCustomerID
		if stripeCustomerID != "" {
			stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
			params := &stripe.SubscriptionListParams{
				Customer: stripeCustomerID,
			}
			params.Filters.AddFilter("limit", "", "1")
			params.Filters.AddFilter("status", "", "all")
			iter := sub.List(params)
			if iter.Next() {
				stripeSubObj := iter.Subscription()
				// Map Stripe subscription fields to local Subscription struct
				subscription = &models.Subscription{
					ID:                 user.ID, // No local ID, use user ID for placeholder
					UserID:             user.ID,
					StripeSubscriptionID: stripeSubObj.ID,
					StripePriceID:      "",
					Status:             string(stripeSubObj.Status),
					CurrentPeriodStart: time.Unix(stripeSubObj.CurrentPeriodStart, 0),
					CurrentPeriodEnd:   time.Unix(stripeSubObj.CurrentPeriodEnd, 0),
					CreatedAt:          time.Unix(stripeSubObj.Created, 0),
					UpdatedAt:          time.Now(),
				}
				if len(stripeSubObj.Items.Data) > 0 {
					subscription.StripePriceID = stripeSubObj.Items.Data[0].Price.ID
				}
			}
		}
	}

	// If we have a StripePriceID, fetch price details from Stripe
	var plan map[string]interface{} = nil
	if subscription != nil && subscription.StripePriceID != "" {
		p, err := price.Get(subscription.StripePriceID, nil)
		if err == nil {
			plan = map[string]interface{}{
				"id":      p.ID,
				"name":    p.Nickname,
				"amount":  p.UnitAmount,
				"currency": string(p.Currency),
				"interval": "",
			}
			if p.Recurring != nil {
				plan["interval"] = string(p.Recurring.Interval)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"user": user, "subscription": subscription, "plan": plan})
}

