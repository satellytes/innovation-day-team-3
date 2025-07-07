Prompt 7: Abonnement-Verwaltungs-Endpunkte
Die APIs für das Frontend, um Abonnements zu verwalten.

Prompt:

"REST-Endpunkte für Abonnement-Verwaltung

Implementiere die REST-Endpunkte für das Abrufen und Verwalten von Abonnements.

Anforderungen:

GET /api/v1/subscriptions/{id} Endpunkt:

Erstelle einen Handler in internal/app/handlers/subscription_handler.go.

Dieser Endpunkt soll ein spezifisches Abonnement aus unserer Datenbank anhand der eigenen id abrufen.

Der Handler ruft den SubscriptionService auf.

Die Antwort sollte die models.Subscription Struktur sein.

POST /api/v1/subscriptions/{id}/cancel Endpunkt:

Dieser Handler soll ein Abonnement in Stripe und in unserer Datenbank stornieren.

Der SubscriptionService soll die Logik kapseln:

Aufruf der Stripe API zum Stornieren des Abonnements.

Aktualisierung des Status in unserer Datenbank auf 'canceled'.

POST /api/v1/subscriptions/{id}/update-plan Endpunkt (optional, kann später):

Hinweis: Dieser Endpunkt ist komplexer, da er die Logik für Preisänderungen und Pro-Rationing in Stripe erfordert. Für den MVP kannst du ihn überspringen oder als Platzhalter anlegen.

Wenn implementiert: Der Handler nimmt eine newPriceId entgegen und ruft den SubscriptionService auf, um den Plan in Stripe und unserer Datenbank zu aktualisieren.

Authentifizierung/Autorisierung: Nimm an, dass die user_id für die Endpunkte über einen Kontext oder aus einem Authentifizierungs-Middleware verfügbar ist, um sicherzustellen, dass nur der berechtigte Benutzer sein eigenes Abonnement verwalten kann. (Du brauchst keine Middleware zu implementieren, nur annehmen, dass die user_id vorhanden ist.)

Fehlerbehandlung: Robuste Fehlerbehandlung, z.B. wenn ein Abonnement nicht gefunden wird oder Stripe-Fehler auftreten.

Gib den Code für die neuen Handler, die erweiterten Service-Methoden und alle notwendigen Anpassungen an der Routenregistrierung aus."