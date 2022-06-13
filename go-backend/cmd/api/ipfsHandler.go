package main

import (
	"fmt"
	"net/http"
	"os"
	"uploader/models"
)

func (app *application) uploadIpfs(w http.ResponseWriter, r *http.Request) {

	fileBytes, fileNames := getFiles("./images")

	hash, err := uploadToIpfs(fileBytes, fileNames, true)
	if err != nil {
		fmt.Println(err)
	}

	for _, file := range fileNames {

		os.Remove("./images/" + file)

		fmt.Println("Removing ", file)

	}

	data := models.Data{
		Hash: hash,
	}

	err = app.writeJSON(w, http.StatusOK, data, "data")
	if err != nil {
		app.errorJSON(w, err)
		return
	}

}
