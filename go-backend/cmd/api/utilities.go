package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

const pinFileURL = "https://api.pinata.cloud/pinning/pinFileToIPFS"

func (app *application) writeJSON(w http.ResponseWriter, status int, data interface{}, wrap string) error {

	wrapper := make(map[string]interface{})

	wrapper[wrap] = data

	js, err := json.Marshal(wrapper)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil

}

func (app *application) errorJSON(w http.ResponseWriter, err error) {
	type jsonError struct {
		Message string `json:"message"`
	}

	theError := jsonError{
		Message: err.Error(),
	}

	app.writeJSON(w, http.StatusBadRequest, theError, "error")
}

func getFiles(fpath string) ([][]byte, []string) {

	//empty slice to hold files
	var files []string

	err := filepath.Walk(fpath, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			log.Println(err)
		}
		//look for png, jpg, or gif files and append them to slice above
		if filepath.Ext(info.Name()) == ".png" || filepath.Ext(info.Name()) == ".jpg" || filepath.Ext(info.Name()) == ".jpeg" || filepath.Ext(info.Name()) == ".gif" {
			files = append(files, filepath.Base(path))
		}
		return nil
	})
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(files)
	var fileBytes [][]byte
	//byteToName := make(map[[]byte]string)

	for _, file := range files {
		fmt.Println("Reading: ", file)
		fileByte, err := ioutil.ReadFile("./images/" + file)
		if err != nil {
			log.Fatalln(err)
		}

		fileBytes = append(fileBytes, fileByte)
	}

	return fileBytes, files
}

func uploadToIpfs(data [][]byte, names []string, wrapWithDirectory bool) (string, error) {
	type pinataResponse struct {
		IPFSHash  string `json:"IpfsHash"`
		PinSize   int    `json:"PinSize"`
		Timestamp string `json:"Timestamp"`
	}
	bodyBuf := &bytes.Buffer{}
	bodyWriter := multipart.NewWriter(bodyBuf)

	for index, v := range data {

		fileWriter, err := bodyWriter.CreateFormFile("file", "images/"+names[index])
		if err != nil {
			log.Println(err)
		}
		if _, err := fileWriter.Write(v); err != nil {
			return "", err
		}
	}

	if wrapWithDirectory {
		fileWriter, err := bodyWriter.CreateFormField("pinataOptions")
		if err != nil {
			return "", err
		}
		if _, err := fileWriter.Write([]byte(`{"wrapWithDirectory": true}`)); err != nil {
			return "", err
		}
	}

	contentType := bodyWriter.FormDataContentType()
	bodyWriter.Close()
	req, err := http.NewRequest("POST", pinFileURL, bodyBuf)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", contentType)
	req.Header.Set("pinata_api_key", os.Getenv("pinata_api_key"))
	req.Header.Set("pinata_secret_api_key", os.Getenv("pinata_api_secret"))

	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	// Do request.
	var (
		retries = 3
		resp    *http.Response
	)
	for retries > 0 {
		resp, err = client.Do(req)
		if err != nil {
			retries -= 1
		} else {
			break
		}
	}
	if resp == nil {
		return "", fmt.Errorf("failed to upload files to ipfs, err: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		errMsg := make([]byte, resp.ContentLength)
		_, _ = resp.Body.Read(errMsg)
		return "", fmt.Errorf("failed to upload file, response code %d, msg: %s", resp.StatusCode, string(errMsg))
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	pinataResp := pinataResponse{}
	err = json.NewDecoder(bytes.NewReader(body)).Decode(&pinataResp)
	if err != nil {
		return "", fmt.Errorf("failed to decode json, err: %v", err)
	}
	if len(pinataResp.IPFSHash) == 0 {
		return "", errors.New("ipfs hash not found in the response body")
	}

	return pinataResp.IPFSHash, err
}
