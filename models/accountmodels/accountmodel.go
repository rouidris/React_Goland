package accountmodels

import (
	"cho-tam-server/config"
	"cho-tam-server/entities"
	"database/sql"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
)

func CreateAccount(account entities.Account) (account_id uint64) {
	tx, err := config.DB.Begin()
	if err != nil {
		log.Fatal(err)
	}
	operation, err := tx.Prepare(
		`INSERT INTO account (username, email, password, banks_card, created_at) 
		VALUES ($1, $2, $3, $4, $5) RETURNING account_id`)
	if err != nil {
		log.Fatal(err)
	}
	defer operation.Close()

	err = operation.QueryRow(account.Username, account.Email, account.Password, account.BanksCard, time.Now()).Scan(&account_id)
	if err != nil {
		log.Fatal(err)
	}

	operation, err = tx.Prepare(`INSERT INTO account_roles (account_id, roles_id) VALUES ($1, $2)`)
	if err != nil {
		log.Fatal(err)
	}
	defer operation.Close()
	var roleID uint8
	if account.Roles == "USER" {
		roleID = 2
	} else {
		roleID = 1
	}

	_, err = operation.Exec(account_id, roleID)
	if err != nil {
		log.Fatal(err)
	}

	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Успешный ввод")
	return account_id
}

func GetUser(account entities.Account) (string, string, uint64, error) {
	var hash string
	var roles string
	var accountId uint64
	err := config.DB.QueryRow(`
        SELECT password FROM account
        WHERE username = $1 OR email = $2`, account.Username, account.Email,
	).Scan(&hash)
	if err != nil {
		return "", roles, 0, err
	}

	err = config.DB.QueryRow(`
        SELECT r.role_name, a.account_id 
        FROM account a 
        JOIN account_roles ar ON a.account_id = ar.account_id
        JOIN roles r ON ar.roles_id = r.roles_id
        WHERE username = $1`,
		account.Username,
	).Scan(&roles, &accountId)

	if err != nil {
		return "", roles, 0, err
	}

	return hash, roles, accountId, nil
}

func GetUserInfo(id uint64) (entities.Account, error) {
	var account entities.Account
	log.Println("Модель id: ", id)
	err := config.DB.QueryRow(`SELECT r.role_name, a.account_id, a.username, a.email, a.banks_card
        FROM account a 
        JOIN account_roles ar ON a.account_id = ar.account_id 
        JOIN roles r ON ar.roles_id = r.roles_id
        WHERE a.account_id = $1`, id).Scan(
		&account.Roles,
		&account.AccountId,
		&account.Username,
		&account.Email,
		&account.BanksCard,
	)
	if err != nil {
		log.Println("данные не вытащены")
		return account, err
	}
	return account, nil

}

func CreateProject(project entities.Project) (projectID uint64) {
	tx, err := config.DB.Begin()
	if err != nil {
		log.Fatal(err)
	}
	defer tx.Rollback()

	coordinatesArray := ConvertToDBArray(project.Coordinates)
	fmt.Println("coordinatesArray: ", coordinatesArray)
	operation, err := tx.Prepare(`
		INSERT INTO Project ( coordinates)
		VALUES ($1)
		RETURNING project_id`)
	if err != nil {
		log.Fatal(err)
	}
	defer operation.Close()

	err = operation.QueryRow(coordinatesArray).Scan(&projectID)
	if err != nil {
		log.Fatal(err)
	}

	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Создан проект с идентификатором:", projectID, " ", project.Coordinates)

	return projectID
}
func ConvertToDBArray(data [][]float64) sql.NullString {
	if len(data) == 0 {
		return sql.NullString{}
	}

	var sb strings.Builder
	sb.WriteString("{")

	for i, row := range data {
		sb.WriteString(fmt.Sprintf("{%f,%f}", row[0], row[1]))

		if i != len(data)-1 {
			sb.WriteString(",")
		}
	}

	sb.WriteString("}")

	return sql.NullString{
		String: sb.String(),
		Valid:  true,
	}
}

func GetProject(projectID int) (*entities.Project, error) {
	// Выполнить запрос к базе данных для получения данных о проекте по идентификатору
	row := config.DB.QueryRow(`
	SELECT project_id, coordinates
	FROM Project
	WHERE project_id = $1`, projectID)

	var project entities.Project
	var coordinatesStr string // Используем строку для сканирования

	err := row.Scan(&project.ProjectId, &coordinatesStr)
	if err != nil {
		if err == sql.ErrNoRows {
			// Проект не найден
			log.Printf("Проект с ID %d не найден\n", projectID)
			return nil, nil
		}
		log.Printf("Ошибка при получении данных о проекте с ID %d: %v\n", projectID, err)
		return nil, err
	}

	// Обработка строки координат
	coordinatesStr = strings.Trim(coordinatesStr, "{}")     // Удаление внешних фигурных скобок
	coordinatePairs := strings.Split(coordinatesStr, "},{") // Разделение на пары координат

	// Создание среза для хранения координат
	project.Coordinates = make([][]float64, len(coordinatePairs))

	// Извлечение и преобразование значений координат
	for i, pair := range coordinatePairs {
		values := strings.Split(pair, ",")
		coordinates := make([]float64, 2)

		for j, value := range values {
			coordinate, err := strconv.ParseFloat(strings.TrimSpace(value), 64)
			if err != nil {
				log.Printf("Ошибка при преобразовании координат проекта с ID %d: %v\n", projectID, err)
				return nil, err
			}
			coordinates[j] = coordinate
		}

		project.Coordinates[i] = coordinates
	}

	// Вывести координаты проекта на консоль сервера
	log.Printf("Координаты проекта с ID %d: %v\n", projectID, project.Coordinates)

	return &project, nil
}

//func CreateField(coordinates []string, ownerAccountID uint64) (fieldID uint64) {
//	tx, err := config.DB.Begin()
//	if err != nil {
//		log.Fatal(err)
//	}
//	defer tx.Rollback()
//
//	operation, err := tx.Prepare(`
//        INSERT INTO Field (coordinates, owner_account_id)
//        VALUES ($1, $2)
//        RETURNING field_id`)
//	if err != nil {
//		log.Fatal(err)
//	}
//	defer operation.Close()
//
//	err = operation.QueryRow(pq.Array(coordinates), ownerAccountID).Scan(&fieldID)
//	if err != nil {
//		log.Fatal(err)
//	}
//
//	err = tx.Commit()
//	if err != nil {
//		log.Fatal(err)
//	}
//
//	fmt.Println("Создано поле с идентификатором:", fieldID, " ", coordinates)
//
//	return fieldID
//}
