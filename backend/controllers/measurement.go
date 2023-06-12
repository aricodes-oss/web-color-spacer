package controllers

import (
	"backend/query"

	"github.com/gin-gonic/gin"
	"net/http"
)

type MeasurementController struct{}

var Measurement = query.Measurement

func (m *MeasurementController) Mount(group *gin.Engine) {
	group.GET("/", m.All)
}

func (m *MeasurementController) All(c *gin.Context) {
	all, err := Measurement.Find()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
	}
	c.JSON(http.StatusOK, gin.H{"measurements": all})
}
