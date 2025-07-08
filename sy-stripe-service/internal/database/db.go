package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

// DB represents a database connection.
type DB struct {
	Postgres *pgxpool.Pool
	SQLite   *sql.DB
}

// NewDB creates a new database connection based on the provided configuration.
func NewDB(databaseURL string) (*DB, error) {
	if databaseURL == "" {
		return nil, fmt.Errorf("database URL cannot be empty")
	}

	if strings.HasPrefix(databaseURL, "postgres") {
		// PostgreSQL connection
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		config, err := pgxpool.ParseConfig(databaseURL)
		if err != nil {
			return nil, fmt.Errorf("unable to parse database URL: %w", err)
		}

		pool, err := pgxpool.NewWithConfig(ctx, config)
		if err != nil {
			return nil, fmt.Errorf("unable to connect to PostgreSQL database: %w", err)
		}

		// Ping the database to ensure the connection is alive
		err = pool.Ping(ctx)
		if err != nil {
			pool.Close()
			return nil, fmt.Errorf("failed to ping PostgreSQL database: %w", err)
		}

		log.Println("Successfully connected to PostgreSQL database!")
		return &DB{Postgres: pool}, nil
	} else if strings.HasPrefix(databaseURL, "file:") || strings.HasPrefix(databaseURL, ":memory:") {
		// SQLite connection
		db, err := sql.Open("sqlite3", databaseURL)
		if err != nil {
			return nil, fmt.Errorf("unable to open SQLite database: %w", err)
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err = db.PingContext(ctx)
		if err != nil {
			db.Close()
			return nil, fmt.Errorf("failed to ping SQLite database: %w", err)
		}

		log.Println("Successfully connected to SQLite database!")
		return &DB{SQLite: db}, nil
	}

	return nil, fmt.Errorf("unsupported database URL scheme: %s", databaseURL)
}

// Close closes the database connection.
func (db *DB) Close() {
	if db.Postgres != nil {
		db.Postgres.Close()
		log.Println("PostgreSQL database connection pool closed.")
	} else if db.SQLite != nil {
		db.SQLite.Close()
		log.Println("SQLite database connection closed.")
	}
}

// Ping checks the database connection.
func (db *DB) Ping(ctx context.Context) error {
	if db.Postgres != nil {
		return db.Postgres.Ping(ctx)
	} else if db.SQLite != nil {
		return db.SQLite.PingContext(ctx)
	}
	return fmt.Errorf("no database connection available")
}

// GetSQLDB returns the underlying *sql.DB for SQLite operations.
func (db *DB) GetSQLDB() *sql.DB {
	return db.SQLite
}

// GetPgxPool returns the underlying *pgxpool.Pool for PostgreSQL operations.
func (db *DB) GetPgxPool() *pgxpool.Pool {
	return db.Postgres
}

// ApplyMigrations applies SQL migrations from a directory to the connected database (SQLite or Postgres).
func ApplyMigrations(db *sql.DB, migrationsDir string) error {
	if db == nil {
		return fmt.Errorf("database connection is nil")
	}

	driverName := "unknown"
	if db != nil {
		// Try to detect driver from db object
		// Unfortunately, sql.DB does not expose the driver name directly
		// so we rely on the DSN sniffing via the connection string
		// or fallback to running a version query
		// This is a best-effort approach
		// If you ever pass a custom driver, update this logic accordingly
		// For now, default to Postgres if it can execute 'SELECT version()'
		row := db.QueryRow("SELECT version()")
		var version string
		if err := row.Scan(&version); err == nil && strings.Contains(strings.ToLower(version), "postgres") {
			driverName = "postgres"
		} else {
			// Try SQLite version
			row := db.QueryRow("SELECT sqlite_version()")
			var sqliteVersion string
			if err := row.Scan(&sqliteVersion); err == nil {
				driverName = "sqlite3"
			}
		}
	}
	log.Printf("ApplyMigrations detected driver: %s", driverName)

	var pattern string
	switch driverName {
	case "sqlite3":
		pattern = "*.sqlite.sql"
	case "postgres":
		pattern = "*.postgres.sql"
	default:
		pattern = "*.sql"
	}

	files, err := filepath.Glob(filepath.Join(migrationsDir, pattern))
	if err != nil {
		log.Printf("Migration file glob error: %v", err)
		return fmt.Errorf("failed to read migration files: %w", err)
	}

	// Fallback: If no driver-specific files, try generic *.sql, but NEVER run the other DB's files
	if len(files) == 0 {
		log.Printf("No %s files found, falling back to *.sql", pattern)
		files, err = filepath.Glob(filepath.Join(migrationsDir, "*.sql"))
		if err != nil {
			log.Printf("Migration file glob error: %v", err)
			return fmt.Errorf("failed to read migration files: %w", err)
		}
	}

	// Filter out any *.postgres.sql or *.sqlite.sql files from the fallback list
	if driverName == "sqlite3" {
		var filtered []string
		for _, f := range files {
			if !strings.HasSuffix(f, ".postgres.sql") {
				filtered = append(filtered, f)
			}
		}
		files = filtered
	} else if driverName == "postgres" {
		var filtered []string
		for _, f := range files {
			if !strings.HasSuffix(f, ".sqlite.sql") {
				filtered = append(filtered, f)
			}
		}
		files = filtered
	}

	sort.Strings(files)

	if len(files) == 0 {
		log.Printf("No migration files found for driver: %s", driverName)
		return nil
	}

	for _, file := range files {
		log.Printf("Applying migration: %s", file)
		content, err := os.ReadFile(file)
		if err != nil {
			log.Printf("Migration read error: %v", err)
			return fmt.Errorf("failed to read migration file %s: %w", file, err)
		}
		_, err = db.Exec(string(content))
		if err != nil {
			log.Printf("Migration exec error: %v", err)
			return fmt.Errorf("failed to execute migration %s: %w", file, err)
		}
	}

	log.Println("All migrations applied successfully")
	return nil
}
