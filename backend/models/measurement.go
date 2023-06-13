package models

import (
	"gorm.io/gorm"
)

type Color struct {
	R float64 `json:"r"`
	G float64 `json:"g"`
	B float64 `json:"b"`
}

type Measurement struct {
	gorm.Model

	From  Color `json:"start" gorm:"embedded;embeddedPrefix:from_"`
	To    Color `json:"end" gorm:"embeddedembeddedPrefix:to_"`
	EndID int

	Distance float64 `json:"distance"`
}

var AllModels = []any{
	Measurement{},
}
