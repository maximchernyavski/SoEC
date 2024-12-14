package routes

import (
	"example.com/web_shit/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine) {
	authenticated := server.Group("/")

	authenticated.Use(middlewares.Verify)
	authenticated.GET("/devices", getDevices)
	authenticated.GET("/devices_ids", getDevicesIDs)
	authenticated.GET("/norms", getNorms)
	authenticated.GET("/reports", getReports)
	authenticated.GET("/serve_report/:id", getReport)

	authenticated.POST("/add_device", addDevice)
	authenticated.POST("/add_norm", addNorm)
	authenticated.POST("/add_report", addReport)

	authenticated.PUT("/edit_device/:id", editDevice)
	authenticated.PUT("/edit_norm/:id", editNorm)

	authenticated.DELETE("/delete_device/:id", deleteDevice)
	authenticated.DELETE("/delete_norm/:id", deleteNorm)
	authenticated.DELETE("/delete_report/:id", deleteReport)

	server.POST("/auth", auth)
	server.POST("/signup", signup)
}
