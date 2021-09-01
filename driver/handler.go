package driver

import (
	"net/http"
)

type HandlerFunc func(http.ResponseWriter, *http.Request)

type Handler interface {
	GetInfo() HandlerFunc
}

type handler struct {
}

func NewHandler() Handler {
	return handler{}
}

func (h handler) GetInfo() HandlerFunc {
	type Version struct {
		Number string
	}

	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte("callback(\"dev-0.0.1\")"))
	}
}
