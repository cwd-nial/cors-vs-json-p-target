package driver

import (
	"embed"
	"github.com/gorilla/mux"
	"io/fs"
	"net/http"
)

var TemplateFs embed.FS

// NewRouter constructs new mux.Router.
func NewRouter(h Handler) *mux.Router {
	r := mux.NewRouter()

	setupRoutes(r, h)
	setupStatikPayment(r)

	return r
}

// setupRoutes setups REST-API routes.
func setupRoutes(r *mux.Router, h Handler) {
	r.Methods(http.MethodGet).Path("/info").HandlerFunc(h.GetInfo())
}

func setupStatikPayment(r *mux.Router) {
	fsys, err := fs.Sub(TemplateFs, "payment")
	if err != nil {
		panic(err)
	}
	h := http.FileServer(http.FS(fsys))

	r.PathPrefix("/payment/").Handler(http.StripPrefix("/payment/", h))
}
