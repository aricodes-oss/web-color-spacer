package main

import (
	"backend/server"

	"github.com/aricodes-oss/std"
)

var log = std.Logger

func main() {
	log.Info("Booting!")
	server.Init()
}
