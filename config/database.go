package config

import (
	"database/sql"
	_ "github.com/lib/pq"
	"log"
)

var DB *sql.DB

func ConnectDB() {
	db, err := sql.Open("postgres", "host=localhost port=5432 user=postgres password=katon dbname=testServer sslmode=disable")
	if err != nil {
		panic(err)
	}
	log.Println("Database connected")

	DB = db
}
