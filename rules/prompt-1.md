Prompt 1: Projektstruktur und Grundgerüst
Dieser Prompt legt das Fundament des Projekts.

Prompt:

"Projektstart: Go-Backend für Stripe-Abonnements mit Postgres

Erstelle die initiale Projektstruktur und das Grundgerüst für ein Go-Backend, das Stripe-Abonnements mit Postgres verwaltet. Das Projekt soll eine saubere Architektur haben, die Skalierbarkeit und Wartbarkeit fördert.

Berücksichtige dabei folgende Punkte:

Modul-Struktur: Verwende Go-Module.

Verzeichnisstruktur:

cmd/api: Hauptanwendungseinstiegspunkt für den HTTP-Server.

internal/app: Enthält die Kernlogik (Services, Handler).

internal/config: Für Konfigurationsmanagement (Umgebungsvariablen).

internal/database: Für die Postgres-Verbindung und Repository-Logik.

internal/models: Go-Structs, die den Datenbanktabellen und Stripe-Objekten entsprechen.

pkg: Für wiederverwendbare, nicht-domänenspezifische Pakete (z.B. Hilfsfunktionen).

migrations: Für SQL-Migrationsdateien (Tool wird später spezifiziert).

.env.example: Beispiel für Umgebungsvariablen.

Abhängigkeiten:

Web Framework: Wähle ein modernes, performantes Go-Web-Framework (z.B. Gin oder Echo) und integriere es. Erstelle einen einfachen GET /health Endpunkt.

Postgres-Treiber: Integriere einen robusten Postgres-Treiber (z.B. github.com/jackc/pgx).

Stripe SDK: Integriere das offizielle Stripe Go-SDK (github.com/stripe/stripe-go/v72).

Konfigurationsmanagement: Integriere eine Bibliothek wie github.com/spf13/viper oder github.com/joho/godotenv für das Laden von Umgebungsvariablen.

Initialisierung:

Die main-Funktion soll die Konfiguration laden, die Datenbankverbindung herstellen und den HTTP-Server starten.

Implementiere eine graceful shutdown für den HTTP-Server.

Beispiel-Code: Füge minimalen Boilerplate-Code für jede genannte Komponente hinzu, um die Struktur zu zeigen. Lege den Fokus auf eine saubere Trennung der Verantwortlichkeiten.

Gib nur den Go-Code und die benötigten Dateistrukturen aus, keine Erklärungen oder Kommentare außerhalb des Codes."
