Prompt 2: Postgres-Schema und Modelle
Nachdem das Grundgerüst steht, definieren wir die Datenbank.

Prompt:

"Datenbank-Schema und Go-Modelle für Abonnements

Basierend auf dem vorherigen Go-Projektgerüst, entwickle das initiale Postgres-Datenbankschema und die entsprechenden Go-Structs in internal/models.

Anforderungen:

Tabellen:

users:

id (UUID, Primary Key)

stripe_customer_id (VARCHAR, UNIQUE, NOT NULL - für die Verknüpfung mit Stripe)

email (VARCHAR, UNIQUE, NOT NULL)

created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

subscriptions:

id (UUID, Primary Key)

user_id (UUID, Foreign Key zu users.id, NOT NULL)

stripe_subscription_id (VARCHAR, UNIQUE, NOT NULL - für die Verknüpfung mit Stripe)

stripe_price_id (VARCHAR, NOT NULL - der abonnierte Stripe-Preisplan)

status (VARCHAR, NOT NULL - z.B. 'active', 'canceled', 'past_due' – wird von Stripe synchronisiert)

current_period_start (TIMESTAMPTZ, NOT NULL)

current_period_end (TIMESTAMPTZ, NOT NULL)

cancel_at_period_end (BOOLEAN, NOT NULL, DEFAULT FALSE)

created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

Go-Structs: Erstelle entsprechende Go-Structs in internal/models für User und Subscription. Verwende json Tags für JSON-Marshalling/Unmarshalling und db Tags für Datenbank-Mapping (z.B. mit pgx oder einer ORM-Bibliothek, falls du dich für eine entscheidest).

SQL-Migrations: Erstelle eine initiale SQL-Migrationsdatei (z.B. 000001_create_users_and_subscriptions_table.up.sql) im migrations-Verzeichnis, die diese Tabellen definiert.

Konzentriere dich auf die Definition der Tabellen und Go-Structs. Gib nur den SQL-Code und die Go-Structs aus."