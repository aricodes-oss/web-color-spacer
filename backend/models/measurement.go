package models

import (
	"gorm.io/gorm"
)

type Color struct {
	gorm.Model

	R float64 `json:"r"`
	G float64 `json:"g"`
	B float64 `json:"b"`
}

type Measurement struct {
	gorm.Model

	Start   Color `json:"start"`
	StartID int

	End   Color `json:"end"`
	EndID int

	Distance float64 `json:"distance"`
}

var AllModels = []any{
	Measurement{},
	Color{},
}
