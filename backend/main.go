package main

import (
	"backend/db"
	"backend/models"
	"backend/query"
	"backend/server"

	"github.com/aricodes-oss/std"
)

var log = std.Logger

func init() {
	query.SetDefault(db.Connection)
	db.Connection.AutoMigrate(models.AllModels...)
}

func main() {
	log.Info("Booting!")
	query.Measurement.Find()
	server.Init()
}
