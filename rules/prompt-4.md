Prompt 4: Stripe Produkt-API-Endpunkt
Nun beginnen wir mit der Stripe-Integration auf der API-Seite.

Prompt:

"Stripe Produkt-API-Endpunkt

Integriere den ersten REST-Endpunkt, um Stripe-Produkte und deren Preise abzurufen.

Anforderungen:

internal/app/handlers/product_handler.go:

Erstelle einen Handler für GET /api/v1/products.

Dieser Handler soll das Stripe Go-SDK verwenden, um alle aktiven Produkte und die zugehörigen aktiven, wiederkehrenden Preise von der Stripe API abzurufen.

Filtere Preise nach type=recurring und sortiere nach created.

Strukturiere die Antwort so, dass sie für das Frontend leicht konsumierbar ist (Produkte mit verschachtelten Preisen, die monatliche und jährliche Optionen enthalten).

Verwende internal/app/services/product_service.go (neu zu erstellen) für die Business-Logik des Abrufs.

internal/app/services/product_service.go (neu):

Definiere ein ProductService Struct, das den Stripe API Client enthält.

Implementiere eine Methode GetProductsWithPrices() ([]models.ProductResponse, error), die die Stripe API aufruft und die Daten für den Handler aufbereitet. Definiere ein neues models.ProductResponse Struct, das die gewünschte Antwortstruktur repräsentiert.

Stripe Client Initialisierung: Zeige, wie der Stripe API Client sicher mit dem API-Schlüssel (aus Umgebungsvariablen) initialisiert und in den Service injiziert wird.

Fehlerbehandlung: Robuste Fehlerbehandlung für API-Aufrufe und Rückgabe aussagekräftiger Fehler an das Frontend.

Aktualisiere cmd/api/main.go und internal/app/routes.go (neu) oder internal/app/handlers/routes.go um den neuen Endpunkt zu registrieren. Gib den gesamten relevanten Code aus."