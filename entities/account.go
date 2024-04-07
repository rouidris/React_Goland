package entities

import (
	"math/big"
	"time"
)

type Account struct {
	AccountId uint64    `json:"Account_ID"`
	Username  string    `json:"Username"`
	Roles     string    `json:"Roles"`
	Password  string    `json:"Password"`
	Email     string    `json:"Email"`
	BanksCard string    `json:"BanksCard"`
	CreatedAt time.Time `json:"CreatedAt"`
}

type Project struct {
	ProjectId   int `json:"ProjectId"`
	Drone       string
	Area        float64
	Coordinates [][]float64 `json:"coordinates"`
}

type Field struct {
	FieldId          int         `json:"FieldId"`
	Coor             [][]float64 `json:"coor"`
	Owner_account_id big.Int     `json:"owner_account_id"`
}
