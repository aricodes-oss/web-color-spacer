package model

import (
	"gorm.io/gorm"
)

type Measurement struct {
	gorm.Model

	R, G, B  float64
	Distance float64
}

var AllModels = []any{
	Measurement{},
}
