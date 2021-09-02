package driver

import (
	"net/http"
)

type HandlerFunc func(http.ResponseWriter, *http.Request)

type Handler interface {
	JsonPTarget() HandlerFunc
	CorsTarget() HandlerFunc
}

type handler struct {
}

func NewHandler() Handler {
	return handler{}
}

func (h handler) JsonPTarget() HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "127.0.0.1")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("jsonpCallback(\"dev-0.0.1\")"))
	}
}

func (h handler) CorsTarget() HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "127.0.0.1")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("\"dev-0.0.1\""))
	}
}
