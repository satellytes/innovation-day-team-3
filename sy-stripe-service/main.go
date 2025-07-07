package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/product"
	"github.com/stripe/stripe-go/v72/sub"
	"github.com/stripe/stripe-go/v72/customer"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Error loading .env file, assuming environment variables are set directly.")
	}

	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	if stripe.Key == "" {
		log.Fatal("STRIPE_SECRET_KEY environment variable not set")
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, Go Stripe Backend!")
	})

	http.HandleFunc("/api/v1/products", getProductsHandler)
	http.HandleFunc("/api/v1/subscriptions/create", createSubscriptionHandler)
	http.HandleFunc("/api/v1/customers/create", createCustomerHandler)

	fmt.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// Request body for creating a customer
type CreateCustomerRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

func createCustomerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CreateCustomerRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	params := &stripe.CustomerParams{
		Email: stripe.String(req.Email),
		Name:  stripe.String(req.Name),
	}

	customer, err := customer.New(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(customer)
}

// Request body for creating a subscription
type CreateSubscriptionRequest struct {
	CustomerID string `json:"customerId"`
	PriceID    string `json:"priceId"`
}

func createSubscriptionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CreateSubscriptionRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.CustomerID == "" || req.PriceID == "" {
		http.Error(w, "Customer ID and Price ID are required", http.StatusBadRequest)
		return
	}

	params := &stripe.SubscriptionParams{
		Customer: stripe.String(req.CustomerID),
		Items: []*stripe.SubscriptionItemsParams{
			{
				Price: stripe.String(req.PriceID),
			},
		},
		// You might want to add more parameters here, e.g., payment_behavior, collection_method
		// For example, to automatically charge the customer:
		PaymentBehavior: stripe.String("default_incomplete"),
		CollectionMethod: stripe.String("charge_automatically"),
	}

	sub, err := sub.New(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sub)
}

func getProductsHandler(w http.ResponseWriter, r *http.Request) {
	params := &stripe.ProductListParams{}
	params.AddExpand("data.default_price") // Include default price in the product object

	iter := product.List(params)

	var products []stripe.Product
	for iter.Next() {
		products = append(products, *iter.Product())
	}

	if err := iter.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}
