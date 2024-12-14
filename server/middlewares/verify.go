package middlewares

import (
	"net/http"
	"strconv"

	"example.com/web_shit/utils"
	"github.com/gin-gonic/gin"
)

func Verify(context *gin.Context) {
	token := context.Request.Header.Get("token")
	isAdmin, err := strconv.ParseBool(context.Request.Header.Get("isAdmin"))

	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Can't parse admin state"})
		return
	}

	_, retrievedIsAdmin, err := utils.VerifyToken(token)

	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Can't verify token"})
		return
	}

	if isAdmin != retrievedIsAdmin {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Wrong admin state"})
		return
	}

	// context.JSON(http.StatusOK, gin.H{"message": "User is verified", "isAdmin": isAdmin})
	context.Next()
}
