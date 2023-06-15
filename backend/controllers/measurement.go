package controllers

import (
	"backend/models"
	"backend/query"
	"fmt"

	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MeasurementController struct{}

func (m *MeasurementController) Mount(group gin.IRouter) {
	group.GET("/", m.All)
	group.POST("/", m.Create)
	group.PATCH("/:id", m.Patch)
	group.DELETE("/:id", m.Delete)
}

func (m *MeasurementController) All(c *gin.Context) {
	var Measurement = query.Measurement
	all, err := Measurement.Find()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, all)
}

func (m *MeasurementController) Create(c *gin.Context) {
	var Measurement = query.Measurement
	var entry models.Measurement
	if err := c.BindJSON(&entry); err != nil {
		fmt.Println(err)
		return
	}

	if err := Measurement.Create(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, entry)
}

func (m *MeasurementController) Patch(c *gin.Context) {
	var Measurement = query.Measurement
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var body models.Measurement

	if err := c.BindJSON(&body); err != nil {
		return
	}

	info, err := Measurement.Where(Measurement.ID.Eq(uint(id))).Updates(body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"info": info, "error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"info": info})
}

func (m *MeasurementController) Delete(c *gin.Context) {
	var Measurement = query.Measurement
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	info, err := Measurement.Where(Measurement.ID.Eq(uint(id))).Delete()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"info": info, "error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"info": info})
}
