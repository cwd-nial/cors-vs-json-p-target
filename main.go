package main

import (
	"embed"
	"github.com/cwd-nial/go-statik/driver"
)

import "github.com/cwd-nial/go-statik/pkg/shutdown"

//go:embed payment
var templateFs embed.FS

func main() {
	driver.TemplateFs = templateFs

	Server().RunWithCancelCtx(shutdown.SignalContext())
}
