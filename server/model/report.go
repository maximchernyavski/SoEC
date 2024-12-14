package model

import (
	"errors"

	"example.com/web_shit/db"
)

type Report struct {
	ID     int64
	Header string
	Body   string
	Date   string
}

func (r *Report) Save() error {
	query := `INSERT INTO reports(header, body) VALUES (?, ?)`

	res, err := db.DB.Exec(query, r.Header, r.Body)
	if err != nil {
		return errors.New("could not insert into devices")
	}

	r.ID, err = res.LastInsertId()
	if err != nil {
		return err
	}

	return nil
}
