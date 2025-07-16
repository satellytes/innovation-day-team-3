package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/invoice"
)

// downloadInvoiceHandler handles invoice download requests.
// It expects a query param ?customerId=...

func downloadInvoiceHandler(c *gin.Context) {
	customerId := c.Query("customerId")
	if customerId == "" {
		c.JSON(400, gin.H{"error": "Missing customerId"})
		return
	}
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
	params := &stripe.InvoiceListParams{
		Customer: stripe.String(customerId),
	}
	iter := invoice.List(params)

	invoices := []map[string]interface{}{}
	for iter.Next() {
		inv := iter.Invoice()
		// Default values
		var planId, planName, productId string
		if len(inv.Lines.Data) > 0 && inv.Lines.Data[0].Price != nil {
			planId = inv.Lines.Data[0].Price.ID
			planName = inv.Lines.Data[0].Price.Nickname
			if inv.Lines.Data[0].Price.Product != nil {
				productId = inv.Lines.Data[0].Price.Product.ID
			}
		}
		invoices = append(invoices, map[string]interface{}{
			"id":       inv.ID,
			"created":  inv.Created,
			"amount_due": inv.AmountDue,
			"currency": inv.Currency,
			"status":   inv.Status,
			"pdf_url":  inv.InvoicePDF,
			"plan_id":  planId,
			"plan_name": planName,
			"product_id": productId,
		})
	}
	if len(invoices) == 0 {
		c.JSON(404, gin.H{"error": "No invoices found for this customer"})
		return
	}
	c.JSON(200, gin.H{"invoices": invoices})
}

