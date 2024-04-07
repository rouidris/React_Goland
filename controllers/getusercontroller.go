package controllers

import (
	"cho-tam-server/entities"
	"cho-tam-server/models/accountmodels"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
)

func GetUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		panic(err)
	}
	if c.Request.Method == "GET" {
		var account entities.Account
		log.Printf("Пользователь id: ", id)
		account, err = accountmodels.GetUserInfo(id)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": http.StatusText(http.StatusUnauthorized)})
			return
		}
		c.Header("Content-Type", "application/json")
		c.JSON(http.StatusOK, gin.H{
			"user_info": account,
		})
	}
}
