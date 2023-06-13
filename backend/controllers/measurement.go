package controllers

import (
	"backend/models"
	"backend/query"

	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type MeasurementController struct{}

var Measurement = query.Measurement

func (m *MeasurementController) Mount(group *gin.Engine) {
	group.GET("/", m.All)
	group.POST("/", m.Create)
	group.PATCH("/:id", m.Patch)
}

func (m *MeasurementController) All(c *gin.Context) {
	all, err := Measurement.Find()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
	}
	c.JSON(http.StatusOK, gin.H{"data": all})
}

func (m *MeasurementController) Create(c *gin.Context) {
	var entry models.Measurement
	if err := c.BindJSON(&entry); err != nil {
		return
	}

	if err := Measurement.Create(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": entry})
}

func (m *MeasurementController) Patch(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var body models.Measurement

	if err := c.BindJSON(&body); err != nil {
		return
	}

	info, err := Measurement.Where(Measurement.ID.Eq(uint(id))).Updates(body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"info": info, "error": err})
	}
	c.JSON(http.StatusOK, gin.H{"info": info})
}
