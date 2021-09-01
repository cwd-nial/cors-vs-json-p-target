package main

import "github.com/cwd-nial/cors-vs-json-p-target/pkg/shutdown"

func main() {
	Server().RunWithCancelCtx(shutdown.SignalContext())
}
