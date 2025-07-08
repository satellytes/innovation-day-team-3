package services

import (
	"os"
	"sy-stripe-service/internal/models"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/product"
	"github.com/stripe/stripe-go/v72/price"
)

type ProductService struct{}

func NewProductService() *ProductService {
	// Ensure Stripe API key is set
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
	return &ProductService{}
}

// GetProductsWithPrices fetches all active Stripe products and their recurring prices.
func (s *ProductService) GetProductsWithPrices() ([]models.ProductResponse, error) {
	var productsResp []models.ProductResponse
	params := &stripe.ProductListParams{}
	params.Active = stripe.Bool(true)
	prodIter := product.List(params)

	for prodIter.Next() {
		prod := prodIter.Product()
		priceParams := &stripe.PriceListParams{
			Product: stripe.String(prod.ID),
		}
		priceParams.Active = stripe.Bool(true)
		priceIter := price.List(priceParams)
		var prices []models.PriceResponse
		for priceIter.Next() {
			p := priceIter.Price()
			if p.Type == "recurring" && p.Recurring != nil {
				prices = append(prices, models.PriceResponse{
					ID:        p.ID,
					Nickname:  p.Nickname,
					UnitAmount: p.UnitAmount,
					Currency:  string(p.Currency),
					Interval:  string(p.Recurring.Interval),
					Created:   p.Created,
				})
			}
		}
		// Sort prices by created (oldest first)
		// (Optional: implement if needed)
		productsResp = append(productsResp, models.ProductResponse{
			ID:          prod.ID,
			Name:        prod.Name,
			Description: prod.Description,
			Active:      prod.Active,
			Prices:      prices,
		})
	}
	if err := prodIter.Err(); err != nil {
		return nil, err
	}
	return productsResp, nil
}
