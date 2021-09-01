package config

import (
	"os"
)

type ServerConfig interface {
	GetAppPort() string
}

type serverConfig struct {
	appPort string
}

func (s serverConfig) GetAppPort() string {
	return s.appPort
}

func ProvideServerConfig() ServerConfig {
	return &serverConfig{
		appPort: os.Getenv("APP_PORT"),
	}
}
