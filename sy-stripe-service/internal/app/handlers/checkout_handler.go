package handlers

import (
	"net/http"
	"strings"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"sy-stripe-service/internal/app/services"
)

type CheckoutHandler struct {
	Service *services.SubscriptionService
	SuccessURL string
	CancelURL  string
}

type CheckoutSessionRequest struct {
	PriceID string `json:"priceId" binding:"required"`
	UserID  string `json:"userId"`
}

type CheckoutSessionResponse struct {
	SessionURL string `json:"sessionUrl"`
}

func NewCheckoutHandler(service *services.SubscriptionService, successURL, cancelURL string) *CheckoutHandler {
	return &CheckoutHandler{Service: service, SuccessURL: successURL, CancelURL: cancelURL}
}

func (h *CheckoutHandler) CreateCheckoutSessionHandler(c *gin.Context) {
	var req CheckoutSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userIDPtr *uuid.UUID
	if req.UserID != "" {
		uid, err := uuid.Parse(req.UserID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
			return
		}
		userIDPtr = &uid
	}

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

	session, err := h.Service.CreateCheckoutSession(req.PriceID, userIDPtr, successURL, h.CancelURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, CheckoutSessionResponse{SessionURL: session.URL})
}
