package main

import (
	"backend/db"
	"backend/models"

	"gorm.io/gen"
)

func main() {
	g := gen.NewGenerator(gen.Config{
		OutPath: "../query",
		Mode:    gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface,
	})

	g.UseDB(db.Connection)
	g.ApplyBasic(models.AllModels...)
	g.Execute()
}
