# Stripe Subscription Backend Service

A Go microservice for managing Stripe subscriptions, customers, and products, with persistent storage (SQLite or Postgres) and a REST API.

## Features
- Stripe subscription and customer management
- Persistent storage (SQLite by default, Postgres supported)
- REST API for subscriptions, customers, products
- Configurable via environment variables
- Docker and Docker Compose support

## Quick Start (Local)

1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd sy-stripe-service
   ```

2. **Set environment variables:**
   Copy `.env.example` to `.env` and fill in your values:
   ```sh
   cp .env.example .env
   # Edit .env and set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, etc.
   ```

3. **Run database migrations:**
   (SQLite is used by default. For Postgres, set `DATABASE_URL` accordingly.)

4. **Start the server:**
   ```sh
   go run cmd/api/main.go
   ```

## Environment Variables
| Name                  | Description                        |
|-----------------------|------------------------------------|
| `DATABASE_URL`        | DB connection string (e.g. `file:stripe-service.db` for SQLite, or Postgres DSN) |
| `STRIPE_SECRET_KEY`   | Stripe API secret key              |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret      |
| `APP_SUCCESS_URL`     | Frontend success URL for Stripe    |
| `APP_CANCEL_URL`      | Frontend cancel URL for Stripe     |
| `SERVER_PORT`         | Port to run the API (default: 8080)|

## REST Endpoints

- `GET    /health` — Health check
- `GET    /api/v1/customer/:id` — Get customer by internal user ID
- `GET    /api/v1/customers` — List all users
- `POST   /api/v1/customers/create` — Create Stripe customer and DB user
- `GET    /api/v1/subscriptions/:id` — Get subscription by internal UUID
- `POST   /api/v1/subscriptions/:id/cancel` — Cancel subscription
- `POST   /api/v1/subscriptions/:id/update-plan` — Update subscription plan (not implemented)
- `POST   /api/v1/subscriptions/create` — Create subscription
- `GET    /api/v1/products` — List Stripe products and prices
- `POST   /api/v1/checkout-session` — Create Stripe checkout session

## Docker (Recommended)

1. **Build and run with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
   This starts the Go backend and a Postgres database.

2. **Override env vars as needed:**
   Edit `docker-compose.yml` or use `.env`.

---

## Development Notes
- Stripe keys must never be committed to source control.
- Webhook endpoint and authentication middleware are recommended for production.

---

For further details, see code comments and the `internal/config/config.go` file.
