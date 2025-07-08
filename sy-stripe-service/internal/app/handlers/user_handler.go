package handlers

import (
	"net/http"
	"sy-stripe-service/internal/app/services"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	Service *services.UserService
}

func NewUserHandler(service *services.UserService) *UserHandler {
	return &UserHandler{Service: service}
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
