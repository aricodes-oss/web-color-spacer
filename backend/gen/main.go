package main

import (
	"backend/db"
	"backend/db/model"

	"gorm.io/gen"
)

func main() {
	g := gen.NewGenerator(gen.Config{
		OutPath: "../query",
		Mode:    gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface,
	})

	g.UseDB(db.Connection)
	g.ApplyBasic(model.AllModels...)
	g.Execute()
}
