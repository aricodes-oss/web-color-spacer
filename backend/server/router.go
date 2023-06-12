package server

import (
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	router := gin.Default()

	// TODO: Mount routes in here
	// v1 := router.Group("v1")
	// measurementGroup := v1.Group("measurement")
	// etc...

	return router
}
