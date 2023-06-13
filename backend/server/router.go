package server

import (
	"backend/controllers"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	router := gin.Default()

	measurements := &controllers.MeasurementController{}

	v1 := router.Group("v1")
	measurementGroup := v1.Group("measurements")
	measurements.Mount(measurementGroup)

	return router
}
