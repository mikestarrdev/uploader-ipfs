package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {

	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)

	router.HandlerFunc(http.MethodPost, "/upload", app.uploadImages)

	router.HandlerFunc(http.MethodPost, "/ipfs", app.uploadIpfs)

	return app.enableCORS(router)

}
