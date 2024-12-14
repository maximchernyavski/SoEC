package utils

import (
	"errors"
	"fmt"
	"os"
)

func GetReportTXT(id int, header, body, date string) ([]byte, error) {
	path := fmt.Sprintf("reports/report%v=%v.txt", date[0:9], id)
	file, err := os.Create(path)
	if err != nil {
		return nil, errors.New("could not create file")
	}
	defer file.Close()

	data := fmt.Sprintf("%v\n%v", header, body)
	_, err = file.WriteString(data)
	if err != nil {
		return nil, errors.New("could not write to file")
	}

	file.Sync()

	return []byte(data), nil
}
