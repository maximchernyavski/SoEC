package routes

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"example.com/web_shit/db"
	"example.com/web_shit/model"
	"example.com/web_shit/utils"
	"github.com/gin-gonic/gin"
)

func getReports(context *gin.Context) {
	query := `SELECT * FROM reports`

	rows, err := db.DB.Query(query)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not get reports"})
		return
	}
	defer rows.Close()

	var data []model.Report
	for rows.Next() {
		report := model.Report{}
		rows.Scan(&report.ID, &report.Header, &report.Body, &report.Date)
		data = append(data, report)
	}

	context.JSON(http.StatusOK, data)
}

func getReport(context *gin.Context) {
	r_id, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse report id"})
		return
	}

	query := `SELECT id, header, body, date FROM reports WHERE id = ?`
	row := db.DB.QueryRow(query, r_id)

	var id int
	var header string
	var body string
	var date string
	err = row.Scan(&id, &header, &body, &date)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse row data"})
		return
	}

	file, err := utils.GetReportTXT(id, header, body, date)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not save report to txt"})
		return
	}

	pwd, _ := os.Getwd()
	filename := fmt.Sprintf("report%v=%v.txt", date[0:9], id)
	// fmt.Println("pwd", pwd)
	// fmt.Println("report path", fmt.Sprintf("%v/reports/report%v=%v.txt", pwd, date[0:9], id), "report.txt")
	fmt.Println(fmt.Sprintf("%v/reports/%v", pwd, filename), filename)
	// fmt.Println("filename", filename)
	context.FileAttachment(fmt.Sprintf("%v/reports/%v", pwd, filename), filename)
	context.JSON(http.StatusOK, gin.H{"message": "report served successfully", "file": file})
}

func addReport(context *gin.Context) {
	var report model.Report
	err := context.ShouldBindJSON(&report)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse request data"})
		return
	}

	err = report.Save()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not save report"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Report succesfully saved", "id": report.ID})
}

func deleteReport(context *gin.Context) {
	r_id, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not parse report id"})
		return
	}

	query := `DELETE FROM reports WHERE id = ?`

	_, err = db.DB.Exec(query, r_id)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not delete report"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Report is successufully deleted"})
}
