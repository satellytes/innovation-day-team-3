# Development Guidelines for Stripe Integration Project

## Build/Configuration Instructions

### Prerequisites
- Go 1.x (the version used in the project)
- Stripe account with API keys

### Environment Setup
The application uses environment variables for configuration. You can set these directly or use a `.env` file in the project root.

Required environment variables:
- `DATABASE_URL`: Connection string for the database
  - For PostgreSQL: `postgres://username:password@localhost:5432/dbname`
  - For SQLite in-memory: `file::memory:?cache=shared`
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `SERVER_PORT`: Port for the HTTP server (defaults to 8080 if not set)

Example `.env` file:
```
DATABASE_URL=file::memory:?cache=shared
STRIPE_SECRET_KEY=sk_test_your_stripe_key
SERVER_PORT=8080
```

### Building and Running
To build and run the service:

```bash
# Navigate to the service directory
cd sy-stripe-service

# Build the application
go build -o stripe-service ./cmd/api

# Run the application
./stripe-service
```

Alternatively, you can run directly without building:
```bash
go run ./cmd/api/main.go
```

## Testing Information

### Running Tests
To run all tests in the project:
```bash
go test ./...
```

To run tests in a specific package with verbose output:
```bash
go test ./internal/app/handlers -v
```

To run a specific test:
```bash
go test ./internal/app/handlers -v -run TestHealthCheckHandler
```

### Adding New Tests
Tests should be placed in the same package as the code they're testing, with filenames ending in `_test.go`.

Example test structure:
```go
package handlers

import (
    "testing"
    // Import other required packages
)

func TestYourFunction(t *testing.T) {
    // Test setup
    
    // Call the function being tested
    
    // Assert the results
}
```

### Test Example
Here's a simple test for the health check endpoint:

```go
package handlers

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
)

func TestHealthCheckHandler(t *testing.T) {
    // Set Gin to test mode
    gin.SetMode(gin.TestMode)

    // Create a new Gin router
    r := gin.Default()

    // Create a new HealthHandler
    healthHandler := NewHealthHandler()

    // Register the health check route
    r.GET("/health", healthHandler.HealthCheckHandler)

    // Create a test request
    req, err := http.NewRequest(http.MethodGet, "/health", nil)
    if err != nil {
        t.Fatalf("Failed to create request: %v", err)
    }

    // Create a response recorder
    w := httptest.NewRecorder()

    // Serve the request
    r.ServeHTTP(w, req)

    // Check the status code
    if w.Code != http.StatusOK {
        t.Errorf("Expected status code %d, got %d", http.StatusOK, w.Code)
    }

    // Parse the response body
    var response map[string]interface{}
    err = json.Unmarshal(w.Body.Bytes(), &response)
    if err != nil {
        t.Fatalf("Failed to parse response body: %v", err)
    }

    // Check the response body
    status, exists := response["status"]
    if !exists {
        t.Error("Expected 'status' field in response, but it was not found")
    }
    if status != "ok" {
        t.Errorf("Expected status to be 'ok', got '%v'", status)
    }
}
```

## Additional Development Information

### Project Structure
- `cmd/api`: Main application entry point
- `internal/app/handlers`: HTTP request handlers
- `internal/app/server`: Server setup and configuration
- `internal/config`: Configuration loading
- `internal/database`: Database connection and migrations
- `internal/models`: Data models
- `migrations`: SQL migration files

### Database Schema
The application uses two main tables:
1. `users`: Stores user information and Stripe customer IDs
2. `subscriptions`: Stores subscription information linked to users

Note: There's a potential issue in the database schema. The `users` table has a TEXT primary key in the migration file, but the User model uses uuid.UUID for the ID field. Similarly, the `subscriptions` table references the user_id as UUID, which might cause issues if the users table's ID is TEXT.

### API Endpoints
- `GET /health`: Health check endpoint
- `POST /api/v1/customers/create`: Create a new Stripe customer
- `POST /api/v1/subscriptions/create`: Create a new subscription
- `GET /api/v1/products`: Get a list of products

### Coding Style
- The project follows standard Go coding conventions
- Uses the Gin web framework for HTTP routing
- Implements dependency injection for better testability
- Separates business logic from HTTP handling

### Debugging
- The application logs important events to the console
- For more detailed logging, you can modify the Gin router configuration in `cmd/api/main.go`
- When running tests, use the `-v` flag for verbose output

### Potential Improvements
1. Add more comprehensive error handling
2. Implement database transactions for operations that modify multiple tables
3. Add authentication and authorization
4. Implement more thorough validation of request payloads
5. Add integration tests with a test database
6. Fix the database schema inconsistency between migrations and models