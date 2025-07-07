package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"
	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

// DB represents the database connection.
type DB struct {
	sqlDB *sql.DB
	pgxPool *pgxpool.Pool // For PostgreSQL specific operations if needed
}

// NewDB creates a new database connection based on the provided URL.
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
		return &DB{pgxPool: pool}, nil
	} else if strings.HasPrefix(databaseURL, "file:") || strings.HasPrefix(databaseURL, ":memory:") {
		// SQLite connection
		sqlDB, err := sql.Open("sqlite3", databaseURL)
		if err != nil {
			return nil, fmt.Errorf("unable to open SQLite database: %w", err)
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err = sqlDB.PingContext(ctx)
		if err != nil {
			sqlDB.Close()
			return nil, fmt.Errorf("failed to ping SQLite database: %w", err)
		}

		log.Println("Successfully connected to SQLite database!")
		return &DB{sqlDB: sqlDB}, nil
	}

	return nil, fmt.Errorf("unsupported database URL scheme: %s", databaseURL)
}

// Close closes the database connection.
func (db *DB) Close() {
	if db.pgxPool != nil {
		db.pgxPool.Close()
		log.Println("PostgreSQL database connection pool closed.")
	} else if db.sqlDB != nil {
		db.sqlDB.Close()
		log.Println("SQLite database connection closed.")
	}
}

// Ping checks the database connection.
func (db *DB) Ping(ctx context.Context) error {
	if db.pgxPool != nil {
		return db.pgxPool.Ping(ctx)
	} else if db.sqlDB != nil {
		return db.sqlDB.PingContext(ctx)
	}
	return fmt.Errorf("no database connection available")
}

// GetSQLDB returns the underlying *sql.DB for SQLite operations.
func (db *DB) GetSQLDB() *sql.DB {
	return db.sqlDB
}

// GetPgxPool returns the underlying *pgxpool.Pool for PostgreSQL operations.
func (db *DB) GetPgxPool() *pgxpool.Pool {
	return db.pgxPool
}
