package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"sy-stripe-service/internal/app/services"
)

type CheckoutHandler struct {
	Service *services.SubscriptionService
	UserService *services.UserService
	SuccessURL string
	CancelURL  string
}

type CheckoutSessionRequest struct {
	PriceID    string `json:"priceId" binding:"required"`
	UserID     string `json:"userId"`
	CustomerID string `json:"customerId"`
}

type CheckoutSessionResponse struct {
	SessionURL string `json:"sessionUrl"`
}

func NewCheckoutHandler(service *services.SubscriptionService, userService *services.UserService, successURL, cancelURL string) *CheckoutHandler {
	return &CheckoutHandler{Service: service, UserService: userService, SuccessURL: successURL, CancelURL: cancelURL}
}

func (h *CheckoutHandler) CreateCheckoutSessionHandler(c *gin.Context) {
	log.Println("[CreateCheckoutSessionHandler] Called")
	var req CheckoutSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[CreateCheckoutSessionHandler] Invalid request: %v", err)

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userIDPtr *uuid.UUID
	if req.UserID != "" {
		uid, err := uuid.Parse(req.UserID)
		if err != nil {
			log.Printf("[CreateCheckoutSessionHandler] Invalid userId: %s", req.UserID)
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
			return
		}
		userIDPtr = &uid
	}
	log.Printf("[CreateCheckoutSessionHandler] userID: %v, customerID: %s, priceID: %s", userIDPtr, req.CustomerID, req.PriceID)

	if h.SuccessURL == "" || h.CancelURL == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "success_url and cancel_url must be configured"})
		return
	}

	// Parametrize success URL with internal user ID if present
	successURL := h.SuccessURL
	if userIDPtr != nil {
		sep := "?"
		if strings.Contains(successURL, "?") {
			sep = "&"
		}
		successURL = successURL + sep + "user_id=" + userIDPtr.String()
	}
	// Always ensure session_id placeholder is present
	if !strings.Contains(successURL, "{CHECKOUT_SESSION_ID}") {
		if strings.Contains(successURL, "?") {
			successURL += "&session_id={CHECKOUT_SESSION_ID}"
		} else {
			successURL += "?session_id={CHECKOUT_SESSION_ID}"
		}
	}

	fmt.Println("Stripe Success URL:", successURL)
	session, err := h.Service.CreateCheckoutSession(req.PriceID, userIDPtr, req.CustomerID, successURL, h.CancelURL)
	if err != nil {
		log.Printf("[CreateCheckoutSessionHandler] ERROR: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Printf("[CreateCheckoutSessionHandler] Checkout session created: %s", session.URL)
	c.JSON(http.StatusOK, CheckoutSessionResponse{SessionURL: session.URL})
}
