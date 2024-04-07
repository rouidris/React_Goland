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
	jwtSecretKey = "secret"
	jwtExpiresAt = 24 * time.Hour
)

func generateToken(username string, email string, role string, account_id uint64) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["account_id"] = account_id
	claims["username"] = username
	claims["email"] = email
	claims["role"] = role
	claims["exp"] = time.Now().Add(jwtExpiresAt).Unix()
	return token.SignedString([]byte(jwtSecretKey))
}

func Login(c *gin.Context) {
	if c.Request.Method == "POST" {
		var account entities.Account
		if err := c.BindJSON(&account); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		hash, userRole, accountId, err := accountmodels.GetUser(account)

		log.Println(hash)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": http.StatusText(http.StatusInternalServerError)})
			return
		}
		err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(account.Password))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": http.StatusText(http.StatusUnauthorized)})
			return
		}

		token, err := generateToken(account.Username, account.Email, userRole, accountId)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": http.StatusText(http.StatusInternalServerError)})
			return
		}

		c.SetCookie("session", "authenticated", 24*60*60, "/", "", false, true)

		c.Header("Content-Type", "application/json")
		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}
