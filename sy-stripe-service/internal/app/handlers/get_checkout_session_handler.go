package handlers

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	stripeSession "github.com/stripe/stripe-go/v72/checkout/session"
)



// GetCheckoutSessionHandler fetches a Stripe Checkout Session by session_id
func (h *CheckoutHandler) GetCheckoutSessionHandler(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "session_id required"})
		return
	}

	// Print first 8 characters of the Stripe key for debug
	stripeKey := stripe.Key
	if len(stripeKey) > 8 {
		fmt.Println("Stripe key prefix:", stripeKey[:8]+"...")
	} else {
		fmt.Println("Stripe key prefix:", stripeKey)
	}

	sess, err := stripeSession.Get(id, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Upsert user in DB using Stripe customer ID and email from session
user, userErr := h.UserService.UpsertUserByStripeCustomer(
    c.Request.Context(),
    sess.CustomerDetails.Email,
    sess.CustomerDetails.Name,
    sess.Customer.ID,
)
if userErr != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to persist user after checkout: " + userErr.Error()})
    return
}
c.JSON(http.StatusOK, gin.H{"session": sess, "user": user})
}
