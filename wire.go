//+build wireinject

package main

import (
	"github.com/cwd-nial/go-statik/config"
	server "github.com/cwd-nial/go-statik/driver"
	"github.com/google/wire"
)

func Server() *server.Server {
	wire.Build(
		config.ProvideServerConfig,
		server.NewServer,
		server.NewRouter,
		server.NewHandler,
	)

	return &server.Server{}
}
