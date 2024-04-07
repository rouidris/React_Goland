package main

import (
	"cho-tam-server/config"
	"cho-tam-server/controllers"
	_ "encoding/json"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDB()
	router := gin.Default()
	cng := cors.DefaultConfig()
	cng.AllowOrigins = []string{"http://localhost:5173"}
	cng.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	cng.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	router.Use(cors.New(cng))

	router.POST("/auth/login", controllers.Login)
	router.POST("/auth/registration", controllers.Registration)
	router.GET("/user/:id", controllers.GetUser)
	router.POST("/user/map", controllers.Area)
	router.GET("/project", controllers.GetArea)

	//log.Println("Server is running on port 8080")
	//project := entities.Project{
	//	Drone: "Some drone",
	//	Area:  100.0,
	//	Coordinates: [][]float64{
	//		{44.56, 56.23},
	//		{44.58, 57.63},
	//		{47.58, 54.63},
	//		{46.58, 52.63},
	//	},
	//}
	//
	//projectID := accountmodels.CreateProject(project)
	//fmt.Println("Создан проект с идентификатором:", projectID, project.Coordinates)

	router.Run(":8080")
}
