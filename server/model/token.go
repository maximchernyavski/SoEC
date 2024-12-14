package model

type Token struct {
	token   string `binding:"required"`
	isAdmin bool   `binding:"required"`
}
