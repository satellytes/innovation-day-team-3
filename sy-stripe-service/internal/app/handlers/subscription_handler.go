package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"sy-stripe-service/internal/app/services"
)

type SubscriptionHandler struct {
	service *services.SubscriptionService
}

func NewSubscriptionHandler(service *services.SubscriptionService) *SubscriptionHandler {
	return &SubscriptionHandler{service: service}
}

// GET /api/v1/subscriptions/:id
func (h *SubscriptionHandler) GetSubscriptionHandler(c *gin.Context) {
	id := c.Param("id")
	sub, err := h.service.GetSubscriptionByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sub)
}

// POST /api/v1/subscriptions/:id/cancel
func (h *SubscriptionHandler) CancelSubscriptionHandler(c *gin.Context) {
	id := c.Param("id")
	// userID := get from context or auth (assumed present)
	err := h.service.CancelSubscription(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "canceled"})
}

// POST /api/v1/subscriptions/:id/update-plan (optional placeholder)
func (h *SubscriptionHandler) UpdatePlanHandler(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "update-plan not implemented"})
}
