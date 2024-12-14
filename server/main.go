package main

import (
	"fmt"
	"time"

	"example.com/web_shit/db"
	"example.com/web_shit/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.InitDB()
	server := gin.Default()
	server.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "token", "isAdmin", "file"},
		ExposeHeaders:    []string{"Content-Type", "Content-Disposition", "Accept-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		},
		MaxAge: 12 * time.Hour,
	}))
	routes.RegisterRoutes(server)
	err := server.Run(":8080")
	if err != nil {
		fmt.Println("Error running server: ", err)
		panic(err)
	}
}
