package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/web_shit/db"
	"example.com/web_shit/model"
	"github.com/gin-gonic/gin"
)

func getDevices(context *gin.Context) {
	query := `SELECT id, name, settings, date, type, state FROM devices`

	rows, err := db.DB.Query(query)
	if err != nil {
		fmt.Println("Error getting rows", err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Cannot get rows"})
		return
	}
	defer rows.Close()

	var data []model.Device
	for rows.Next() {
		device := model.Device{}
		rows.Scan(&device.ID, &device.Name, &device.Settings, &device.Date, &device.Type, &device.State)
		data = append(data, device)
	}

	context.JSON(http.StatusOK, data)
}

func getDevicesIDs(context *gin.Context) {
	query := `SELECT id FROM devices`

	rows, err := db.DB.Query(query)
	if err != nil {
		fmt.Println("Error getting rows", err)
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Cannot get rows"})
		return
	}
	defer rows.Close()

	var data []model.Device
	for rows.Next() {
		device := model.Device{}
		rows.Scan(&device.ID)
		data = append(data, device)
	}

	context.JSON(http.StatusOK, data)
}

func addDevice(context *gin.Context) {
	var device model.Device
	err := context.ShouldBindJSON(&device)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse request data"})
		return
	}

	err = device.Save()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not save device"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Device succesfully saved", "id": device.ID})
}

func editDevice(context *gin.Context) {
	d_id, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse device id"})
		return
	}

	var device model.Device
	device.ID = d_id
	err = context.ShouldBindJSON(&device)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse request data"})
		return
	}

	query := `UPDATE devices
			  SET name = ?, settings = ?, date = ?, type = ?, state = ?
			  WHERE id = ?`

	_, err = db.DB.Exec(query, device.Name, device.Settings, device.Date, device.Type, device.State, device.ID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not change device"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Device is changed"})
}

func deleteDevice(context *gin.Context) {
	d_id, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse device id"})
		return
	}

	query := `DELETE FROM devices WHERE id = ?`

	_, err = db.DB.Exec(query, d_id)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not delete device"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Device is successufully deleted"})
}
