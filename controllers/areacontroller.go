package controllers

import (
	"cho-tam-server/entities"
	"cho-tam-server/models/accountmodels"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func Area(c *gin.Context) {
	if c.Request.Method == "POST" {
		var project entities.Project
		if err := c.BindJSON(&project); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Выполнение операций по сохранению проекта в базе данных
		projectID := accountmodels.CreateProject(project)
		log.Println(projectID)

		c.JSON(http.StatusOK, gin.H{"project_id": projectID})
	}
}
