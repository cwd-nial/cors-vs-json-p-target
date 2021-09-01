package driver

import (
	"github.com/cwd-nial/go-statik/payment"
	"github.com/gorilla/mux"
	"net/http"
)

// NewRouter constructs new mux.Router.
func NewRouter(h Handler) *mux.Router {
	r := mux.NewRouter()

	setupRoutes(r, h)
	setupPayment(r)

	return r
}

// setupRoutes setups REST-API routes.
func setupRoutes(r *mux.Router, h Handler) {
	r.Methods(http.MethodGet).Path("/info").HandlerFunc(h.GetInfo())
}

func setupPayment(r *mux.Router) {
	h := http.FileServer(http.FS(payment.GetStaticFiles()))
	r.PathPrefix("/payment/").Handler(http.StripPrefix("/payment/", h))
}
