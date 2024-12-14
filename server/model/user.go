package model

import (
	"errors"

	"example.com/web_shit/db"
	"example.com/web_shit/utils"
)

type User struct {
	ID       int64
	Login    string `binding:"required"`
	Password string `binding:"required"`
	IsAdmin  bool   `json:"isAdmin"`
}

func (u *User) ValidateCredentials() error {
	query := "SELECT id, password, isAdmin FROM users WHERE login = ?"
	row := db.DB.QueryRow(query, u.Login)

	var retrievedPassword string
	var isAdmin bool
	err := row.Scan(&u.ID, &retrievedPassword, &isAdmin)
	u.IsAdmin = isAdmin

	if err != nil {
		return errors.New("credentials invalid")
	}

	passwordIsValid := utils.CheckPasswordHash(u.Password, retrievedPassword)
	if !passwordIsValid {
		return errors.New("credentials invalid")
	}

	return nil
}

func (u *User) Save() error {
	query := "INSERT INTO users(login, password, isAdmin) VALUES (?, ?, ?)"

	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}
	defer stmt.Close()

	hashedPassword, err := utils.HashPassword(u.Password)

	if err != nil {
		return err
	}

	result, err := stmt.Exec(u.Login, hashedPassword, u.IsAdmin)
	if err != nil {
		return err
	}

	userID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	u.ID = userID
	return nil
}
