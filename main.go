package main

import "github.com/cwd-nial/go-statik/pkg/shutdown"

func main() {
	Server().RunWithCancelCtx(shutdown.SignalContext())
}
