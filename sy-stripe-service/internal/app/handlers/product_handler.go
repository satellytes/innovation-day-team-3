package handlers

import (
	"net/http"
	"sy-stripe-service/internal/app/services"
	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	Service *services.ProductService
}

func NewProductHandler(service *services.ProductService) *ProductHandler {
	return &ProductHandler{Service: service}
}

func (h *ProductHandler) GetProductsHandler(c *gin.Context) {
	products, err := h.Service.GetProductsWithPrices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}
