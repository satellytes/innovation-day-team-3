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

	"github.com/jackc/pgx/v4/pgxpool"
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

		pool, err := pgxpool.ConnectConfig(ctx, config)
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

// ApplyMigrations applies SQL migrations from a directory to the SQLite database.
func ApplyMigrations(sqliteDB *sql.DB, migrationsDir string) error {
	if sqliteDB == nil {
		return fmt.Errorf("SQLite database connection is nil")
	}

	// Read migration files from the directory
	files, err := filepath.Glob(filepath.Join(migrationsDir, "*.sql"))
	if err != nil {
		return fmt.Errorf("failed to read migration files: %w", err)
	}

	// Sort files to ensure they are applied in order
	sort.Strings(files)

	for _, file := range files {
		log.Printf("Applying migration: %s", file)
		
		// Read the SQL file
		content, err := os.ReadFile(file)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", file, err)
		}

		// Execute the SQL
		_, err = sqliteDB.Exec(string(content))
		if err != nil {
			return fmt.Errorf("failed to execute migration %s: %w", file, err)
		}
	}

	log.Println("All migrations applied successfully")
	return nil
}
