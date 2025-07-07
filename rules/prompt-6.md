Prompt 6: Stripe Webhook-Handler
Der kritische Teil für die Statusaktualisierung und die Abwicklung von Abonnements.

Prompt:

"Stripe Webhook-Handler für Abonnement-Ereignisse

Implementiere den sicheren Webhook-Endpunkt, der auf Stripe-Ereignisse reagiert und den internen Abonnementstatus in Postgres aktualisiert.

Anforderungen:

POST /api/v1/webhooks/stripe Endpunkt:

Erstelle einen Handler in internal/app/handlers/webhook_handler.go.

Dieser Handler muss die Webhook-Signatur verifizieren (stripe.Webhook.ConstructEvent). Der Stripe-Webhook-Geheimnis muss aus Umgebungsvariablen geladen werden.

Verwende einen Service (z.B. internal/app/services/webhook_service.go, neu zu erstellen), um die eigentliche Ereignisverarbeitung zu kapseln.

internal/app/services/webhook_service.go (neu):

Definiere ein WebhookService Struct, das den UserService und SubscriptionService enthält.

Implementiere eine Methode HandleStripeEvent(event stripe.Event) error.

Diese Methode soll folgende Stripe-Ereignistypen verarbeiten:

checkout.session.completed:

Überprüfe den mode der Session, um sicherzustellen, dass es ein Abonnement ist.

Hole die customer und subscription IDs aus dem Event-Objekt.

Erstelle oder aktualisiere den User in unserer Datenbank basierend auf der customer.id und den metadata (falls userID aus der Checkout Session vorhanden ist).

Erstelle das Subscription-Objekt in unserer Datenbank mit den Details von Stripe.

customer.subscription.updated:

Aktualisiere den Status des Abonnements in unserer Datenbank (z.B. status, current_period_end, cancel_at_period_end).

customer.subscription.deleted:

Markiere das Abonnement in unserer Datenbank als canceled oder lösche es logisch.

invoice.payment_succeeded:

Optional: Bestätige den Status des Abonnements oder führe andere Aktionen aus (z.B. Benachrichtigungen).

Implementiere eine robuste Fehlerbehandlung und Logging für die Webhook-Verarbeitung.

Asynchronität: Betone, dass Webhooks schnell geantwortet werden müssen (200 OK) und komplexere Logik asynchron verarbeitet werden sollte (Hinweis für später, falls zutreffend). Für den Anfang ist eine synchrone Verarbeitung akzeptabel.

Sicherheit: Betone die Wichtigkeit der Webhook-Signaturüberprüfung.

Gib den Code für den neuen Handler, den neuen Service und alle notwendigen Anpassungen an der Konfiguration und Routenregistrierung aus."