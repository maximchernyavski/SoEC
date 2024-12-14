package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/web_shit/db"
	"example.com/web_shit/model"
	"github.com/gin-gonic/gin"
)

func getNorms(context *gin.Context) {
	query := `SELECT id, max_value, allowable_value, device_id FROM norms`

	rows, err := db.DB.Query(query)
	if err != nil {
		fmt.Println("Error getting norms")
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Cannot get norms"})
		return
	}
	defer rows.Close()

	var data []model.Norm
	for rows.Next() {
		norm := model.Norm{}
		rows.Scan(&norm.ID, &norm.Max_value, &norm.Allowable_value, &norm.Device_id)
		data = append(data, norm)
	}

	context.JSON(http.StatusOK, data)
}

func addNorm(context *gin.Context) {
	var norm model.Norm
	err := context.ShouldBindJSON(&norm)
	fmt.Println(norm)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse request data"})
		return
	}

	err = norm.Save()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not save norm"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Norm succesfully saved", "id": norm.ID})
}

func editNorm(context *gin.Context) {
	n_id, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse norm id"})
		return
	}

	var norm model.Norm
	norm.ID = n_id
	err = context.ShouldBindJSON(&norm)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse request data"})
		return
	}

	query := `UPDATE norms
			  SET max_value = ?, allowable_value = ?, device_id = ?
			  WHERE id = ?`

	_, err = db.DB.Exec(query, norm.Max_value, norm.Allowable_value, norm.Device_id, norm.ID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not change norm"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Norm is changed"})
}

func deleteNorm(context *gin.Context) {
	n_id, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse norm id"})
		return
	}

	query := `DELETE FROM norms WHERE id = ?`

	_, err = db.DB.Exec(query, n_id)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not delete norm"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Norm is successufully deleted"})
}
