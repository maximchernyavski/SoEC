package db

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "api.db")

	if err != nil {
		panic("Could not connect to database.")
	}

	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)

	createTables()
}

func createTables() {
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		login TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		isAdmin BOOLEAN NOT NULL
	)
	`

	_, err := DB.Exec(createUsersTable)

	if err != nil {
		fmt.Println(err)
		panic("Could not create users table.")
	}

	createDevicesTable := `
	CREATE TABLE IF NOT EXISTS devices (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		model TEXT,
		serial_number TEXT,
		settings TEXT NOT NULL,
		date TEXT NOT NULL DEFAULT current_date,
		type TEXT NOT NULL,
		state BOOLEAN NOT NULL,
		consumption FLOAT NOT NULL
	)
	`

	_, err = DB.Exec(createDevicesTable)

	if err != nil {
		fmt.Println(err)
		panic("Could not create devices table.")
	}

	createNormTable := `
	CREATE TABLE IF NOT EXISTS norms (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		norm_date DATE DEFAULT CURRENT_DATE,
		max_value INT NOT NULL,
		allowable_value INT NOT NULL,
		device_id INTEGER NOT NULL UNIQUE,
		FOREIGN KEY(device_id) REFERENCES devices(id)
	)
	`

	_, err = DB.Exec(createNormTable)

	if err != nil {
		fmt.Println(err)
		panic("Could not create norms table.")
	}

	createReportTable := `
	CREATE TABLE IF NOT EXISTS reports (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		header TEXT NOT NULL,
		body TEXT NOT NULL,
		date DATE DEFAULT CURRENT_DATE
	)
	`
	_, err = DB.Exec(createReportTable)

	if err != nil {
		fmt.Println(err)
		panic("Could not create reports table")
	}
}
