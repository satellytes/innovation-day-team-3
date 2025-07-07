Prompt 3: Datenbank-Repository und Service-Schicht
Jetzt kommt die Logik zur Interaktion mit der Datenbank und der Aufbau der Service-Schicht.

Prompt:

"Datenbank-Repository und Service-Schicht für Benutzer und Abonnements

Erweitere das Go-Backend um die Repository-Schicht für die Interaktion mit Postgres und eine Service-Schicht, die die Geschäftslogik kapselt.

Anforderungen:

internal/database/repositories.go:

Definiere ein UserRepository Interface mit Methoden wie CreateUser(user *models.User) (*models.User, error) und GetUserByStripeCustomerID(customerID string) (*models.User, error).

Definiere ein SubscriptionRepository Interface mit Methoden wie CreateSubscription(sub *models.Subscription) (*models.Subscription, error), GetSubscriptionByStripeSubscriptionID(subID string) (*models.Subscription, error), UpdateSubscriptionStatus(subID, status string) error, UpdateSubscription(sub *models.Subscription) (*models.Subscription, error).

Implementiere konkrete PostgresUserRepository und PostgresSubscriptionRepository Structs, die diese Interfaces erfüllen und pgx für die Datenbankoperationen verwenden.

internal/app/services/user_service.go:

Definiere ein UserService Struct, das ein UserRepository enthält.

Implementiere Methoden wie CreateUser(email string, stripeCustomerID string) (*models.User, error).

internal/app/services/subscription_service.go:

Definiere ein SubscriptionService Struct, das ein SubscriptionRepository und eine Abhängigkeit zum Stripe API-Client enthält.

Implementiere Platzhalter-Methoden wie CreateSubscription(userID uuid.UUID, priceID string) (*models.Subscription, error), CancelSubscription(subscriptionID uuid.UUID) error, UpdateSubscriptionStatus(stripeSubscriptionID, status string, currentPeriodEnd time.Time, cancelAtPeriodEnd bool) error. Die Stripe-Interaktion wird in einem späteren Schritt hinzugefügt.

Fehlerbehandlung: Nutze Go-Idiome für die Fehlerbehandlung. Definiere ggf. eigene Fehlertypen.

Abhängigkeitsinjektion: Bereite die Services so vor, dass sie ihre Repositories und den Stripe-Client über Abhängigkeitsinjektion erhalten.

Gib den Code für die genannten Go-Dateien aus und aktualisiere bei Bedarf cmd/api/main.go um die Initialisierung der Repositories und Services zu zeigen."
