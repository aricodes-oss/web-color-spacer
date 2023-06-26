package db

import (
	"fmt"
	"net/url"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var Connection *gorm.DB
var ConnectionString string

func init() {
	var dialect gorm.Dialector

	ConnectionString = os.Getenv("DB_PATH")
	if ConnectionString == "" {
		ConnectionString = "sqlite://data.db"
	}

	parsed, err := url.Parse(ConnectionString)
	if err != nil {
		panic(err)
	}

	switch parsed.Scheme {
	case "sqlite":
		dialect = sqlite.Open(parsed.Host)
	// `postgresql` is the canonical version, but we'll accept a few common values
	case "postgresql", "postgres", "psql":
		password, passwordSet := parsed.User.Password()
		if !passwordSet {
			panic("No password set on connection URI")
		}

		// There's probably a decent parsing library out there for this purpose
		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			parsed.Hostname(),
			parsed.User.Username(),
			password,
			parsed.Path[1:], // Trim leading forward slash
			parsed.Port(),
		)

		dialect = postgres.Open(dsn)
	}

	Connection, _ = gorm.Open(dialect)
}
