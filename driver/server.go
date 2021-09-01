package driver

import (
	"context"
	"fmt"
	"github.com/cwd-nial/go-statik/config"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"net/http"
	"time"
)

const (
	ReadTimeout  = time.Second * 3
	WriteTimeout = time.Second * 3
)

type Server struct {
	config config.ServerConfig
	*http.Server
}

func NewServer(r *mux.Router, config config.ServerConfig) *Server {
	port := config.GetAppPort()
	if port == "" {
		logrus.Fatal("No server port provided")
	}

	return &Server{
		config,
		&http.Server{
			Handler:      r,
			Addr:         fmt.Sprintf(":%s", port),
			ReadTimeout:  ReadTimeout,
			WriteTimeout: WriteTimeout,
		},
	}
}

func (s Server) RunWithCancelCtx(ctx context.Context) {
	doneCh := make(chan struct{})

	go func() {
		select {
		case <-ctx.Done():
			shutdownCtx, cancel := context.WithTimeout(
				context.Background(),
				time.Second*5,
			)
			defer cancel()
			if err := s.Shutdown(shutdownCtx); err != nil {
				logrus.Errorf("API Server error: %s", err)
			}
		case <-doneCh:
		}
	}()

	logrus.Infof("API Server started at port: %s", s.config.GetAppPort())
	if err := s.ListenAndServe(); err != nil {
		logrus.Errorf("API Server error: %s", err)
	}

	close(doneCh)
}
