package controllers

import (
	"cho-tam-server/entities"
	"cho-tam-server/models/accountmodels"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"time"
)

const (
	newJwtSecretKey = "secret"
	newJwtExpiresAt = 24 * time.Hour
)

func generateTokenJwt(username string, email string, role string, accountId uint64) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["account_id"] = accountId
	claims["username"] = username
	claims["email"] = email
	claims["role"] = role
	claims["exp"] = time.Now().Add(newJwtExpiresAt).Unix()
	return token.SignedString([]byte(newJwtSecretKey))
}

func Registration(c *gin.Context) {
	if c.Request.Method == "POST" {
		var account entities.Account
		if err := c.BindJSON(&account); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(account.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": http.StatusText(http.StatusInternalServerError)})
			return
		}
		account.Password = string(hashedPassword)

		account_id := accountmodels.CreateAccount(account)
		log.Println(account_id)
		token, err := generateTokenJwt(account.Username, account.Email, account.Roles, account_id)
		if err != nil {
			http.StatusText(http.StatusInternalServerError)
			return
		}

		c.SetCookie("session", "authenticated", 24*60*60, "/", "", false, true)

		c.Header("Content-Type", "application/json")
		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}
