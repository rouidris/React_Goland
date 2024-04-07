package controllers

import (
	"cho-tam-server/entities"
	"cho-tam-server/models/accountmodels"
	_ "encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
)

func GetArea(c *gin.Context) {
	if c.Request.Method == "GET" {
		projectIdStr := c.Query("ProjectId")
		projectId, err := strconv.Atoi(projectIdStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ProjectId"})
			return
		}
		var payload entities.Project
		payload.ProjectId = projectId
		log.Println("Project id: ", payload.ProjectId)
		log.Println("Project coordinates: ", payload.Coordinates)

		// Получение данных о проекте из базы данных
		project, err := accountmodels.GetProject(payload.ProjectId)

		// Отправка данных о проекте в ответе на запрос
		c.Header("Content-Type", "application/json")
		c.JSON(http.StatusOK, gin.H{"project": project})
	}
}
