package payment

import "embed"

//go:embed *.html *.ico *.css *.js
var static embed.FS

func GetStaticFiles() embed.FS {
	return static
}
