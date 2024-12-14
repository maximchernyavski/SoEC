package model

import (
	"errors"
	"time"

	"example.com/web_shit/db"
)

type Device struct {
	ID       int64
	Name     string
	Settings string
	Date     string
	Type     string
	State    bool
}

func (d *Device) Save() error {
	query := `INSERT INTO devices(name, settings, date, type, state) VALUES (?, ?, ?, ?, ?)`

	if len(d.Date) == 0 {
		d.Date = time.Now().Format("2006-01-02")
	}

	res, err := db.DB.Exec(query, d.Name, d.Settings, d.Date, d.Type, d.State)
	if err != nil {
		return errors.New("could not insert into devices")
	}

	d.ID, err = res.LastInsertId()
	if err != nil {
		return err
	}

	return nil
}
