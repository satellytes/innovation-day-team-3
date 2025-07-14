package app

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"sy-stripe-service/internal/config"
	"sy-stripe-service/internal/database"

)

// Server holds the Gin router and database connection
type Server struct {
	Router *gin.Engine
	DB     *database.DB
	Config *config.Config
}

// NewServer creates a new Server instance
func NewServer(db *database.DB, cfg *config.Config) *Server {
	r := gin.Default()

	// Register handlers
	// handlers.RegisterHealthRoutes(r)

	// Register checkout session handler and dependencies
	SetupCheckoutRoutes(r, db, cfg.AppSuccessURL, cfg.AppCancelURL)

	return &Server{
		Router: r,
		DB:     db,
		Config: cfg,
	}
}

// Start runs the HTTP server
func (s *Server) Start() error {
	addr := fmt.Sprintf(":%s", s.Config.ServerPort)
	fmt.Printf("Server is running on port %s\n", s.Config.ServerPort)
	return http.ListenAndServe(addr, s.Router)
}
