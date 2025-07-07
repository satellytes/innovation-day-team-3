Prompt 5: Checkout Session und Abonnement-Erstellung
Der zentrale Teil: Zahlungsinitiierung und Abonnement-Erstellung. Hier verwenden wir Stripe Checkout Sessions, da diese den PCI-Compliance-Aufwand minimieren.

Prompt:

"Stripe Checkout Session Erstellung für Abonnements

Implementiere den REST-Endpunkt zur Erstellung einer Stripe Checkout Session für die Abonnement-Erstellung.

Anforderungen:

POST /api/v1/checkout-session Endpunkt:

Erstelle einen Handler in internal/app/handlers/checkout_handler.go.

Der Request-Body soll die priceId (des ausgewählten Stripe-Preises) und optional die userId (falls der Benutzer bereits in unserem System existiert) enthalten.

Der Handler ruft eine Methode im SubscriptionService auf, um die Checkout Session zu erstellen.

internal/app/services/subscription_service.go Erweiterung:

Ergänze eine Methode CreateCheckoutSession(priceID string, userID *uuid.UUID) (*stripe.CheckoutSession, error).

Diese Methode soll:

Eine neue Stripe Checkout Session vom Typ mode: "subscription" erstellen.

Den line_items den priceID und eine Menge von 1 hinzufügen.

success_url und cancel_url konfigurieren (diese sollten aus der Konfiguration kommen).

Optional den customer Parameter setzen, falls eine userID übergeben wird und ein entsprechender stripe_customer_id in unserer Datenbank existiert. Andernfalls wird Stripe einen neuen Kunden erstellen.

Wichtige Metadaten zur Checkout Session hinzufügen, wie z.B. die userID (falls vorhanden), um sie später in Webhooks wiederzuerkennen.

Fehlerbehandlung: Robuste Fehlerbehandlung für Stripe API-Fehler und Validierungsfehler.

Konfiguration: Stelle sicher, dass success_url und cancel_url über Umgebungsvariablen geladen werden.

Gib den Code für den neuen Handler, die erweiterte Service-Methode und alle notwendigen Anpassungen an der Konfiguration und Routenregistrierung aus."