package main

import (
	"backend/server"

	"github.com/aricodes-oss/std"
	"github.com/ethereum/go-ethereum/log"
)

var logger = std.Logger

func main() {
	log.Info("Booting!")
	server.Init()
}
