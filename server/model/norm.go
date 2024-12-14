package model

import (
	"errors"

	"example.com/web_shit/db"
)

type Norm struct {
	ID              int64
	Max_value       int64
	Allowable_value int64
	Device_id       int64
}

func (n *Norm) Save() error {
	query := `INSERT INTO norms(max_value, allowable_value, device_id) VALUES (?, ?, ?)`

	res, err := db.DB.Exec(query, n.Max_value, n.Allowable_value, n.Device_id)
	if err != nil {
		return errors.New("could not insert into devices")
	}

	n.ID, err = res.LastInsertId()
	if err != nil {
		return err
	}

	return nil
}
