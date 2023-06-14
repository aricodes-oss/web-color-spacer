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

	ID   uint  `gorm:"primarykey" json:"id,omitempty"`
	From Color `json:"start" gorm:"embedded;embeddedPrefix:from_"`
	To   Color `json:"end" gorm:"embedded;embeddedPrefix:to_"`

	Distance float64 `json:"distance"`
}

var AllModels = []any{
	Measurement{},
}
