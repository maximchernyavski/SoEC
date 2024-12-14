package routes

import (
	"fmt"
	"net/http"

	"example.com/web_shit/model"
	"example.com/web_shit/utils"
	"github.com/gin-gonic/gin"
)

func signup(context *gin.Context) {
	var user model.User
	err := context.ShouldBindJSON(&user)
	fmt.Println("User data", user.Login, user.Password, user.IsAdmin)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data"})
		return
	}

	err = user.Save()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not save user."})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"message": "User created!", "user": user})
}

func auth(context *gin.Context) {
	var user model.User
	err := context.ShouldBindJSON(&user)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data"})
		return
	}

	err = user.ValidateCredentials()
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Could not authenticate user."})
		return
	}

	token, err := utils.GenerateToken(user.Login, user.ID, user.IsAdmin)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Could not authenticate user."})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Login successfull.", "token": token, "isAdmin": user.IsAdmin})
}
