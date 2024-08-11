package main

import (
	"encoding/json"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"
)

type Task struct {
	ID          string     `json:"id"`
	Description string     `json:"description"`
	Group       string     `json:"group"`
	Priority    uint8      `json:"priority"`
	CreatedAt   time.Time  `json:"created_at"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
}

var tasks []Task = []Task{}
var tasksMutex sync.Mutex
var dataMutex sync.Mutex
var dataFile = "../data.json"
var serverPort = "8080"

func init() {
	if path := os.Getenv("DATAFILE_PATH"); path != "" {
		dataFile = path
	}

	if port := os.Getenv("SERVER_PORT"); port != "" {
		serverPort = port
	}
}

func main() {
	e := echo.New()
	logger := logrus.New()
	e.Use(echoLogger(logger))
	e.Use(middleware.Recover())

	if err := loadTasks(); err != nil && os.IsNotExist(err) {
		saveTasks()
	}

	e.Static("/", "static")

	e.GET("/api/tasks", getTasks)
	e.POST("/api/tasks", createTask)
	e.PUT("/api/tasks/:id", updateTask)
	e.DELETE("/api/tasks/:id", deleteTask)
	e.PUT("/api/tasks/:id/complete", completeTask)
	e.PUT("/api/tasks/:id/return", returnTask)

	e.Logger.Fatal(e.Start(":" + serverPort))
}

func loadTasks() error {
	dataMutex.Lock()
	defer dataMutex.Unlock()

	file, err := os.Open(dataFile)
	if err != nil {
		return err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	return decoder.Decode(&tasks)
}

func saveTasks() {
	dataMutex.Lock()
	defer dataMutex.Unlock()

	file, err := os.OpenFile(dataFile, os.O_CREATE|os.O_RDWR|os.O_TRUNC, 0644)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	if err := encoder.Encode(tasks); err != nil {
		panic(err)
	}
}

func getTasks(c echo.Context) error {
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	return c.JSON(http.StatusOK, tasks)
}

func createTask(c echo.Context) error {
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	var newTask Task
	if err := c.Bind(&newTask); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	newTask.ID = uuid.New().String()
	newTask.CreatedAt = time.Now()
	tasks = append(tasks, newTask)
	saveTasks()
	return c.JSON(http.StatusOK, newTask)
}

func updateTask(c echo.Context) error {
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	id := c.Param("id")
	var updatedTask Task
	if err := c.Bind(&updatedTask); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	for i, t := range tasks {
		if t.ID == id {
			updatedTask.ID = t.ID
			updatedTask.CreatedAt = t.CreatedAt
			tasks[i] = updatedTask
			saveTasks()
			return c.JSON(http.StatusOK, updatedTask)
		}
	}

	return c.JSON(http.StatusNotFound, map[string]string{"error": "Task not found"})
}

func deleteTask(c echo.Context) error {
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	id := c.Param("id")
	for i, t := range tasks {
		if t.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)
			saveTasks()
			return c.NoContent(http.StatusNoContent)
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"error": "Task not found"})
}

func completeTask(c echo.Context) error {
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	id := c.Param("id")
	for i, t := range tasks {
		if t.ID == id {
			tn := time.Now()
			tasks[i].CompletedAt = &tn
			saveTasks()
			return c.JSON(http.StatusOK, tasks[i])
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"error": "Task not found"})
}

func returnTask(c echo.Context) error {
	tasksMutex.Lock()
	defer tasksMutex.Unlock()

	id := c.Param("id")
	for i, t := range tasks {
		if t.ID == id {
			tasks[i].CompletedAt = nil
			saveTasks()
			return c.JSON(http.StatusOK, tasks[i])
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"error": "Task not found"})
}

func echoLogger(logger *logrus.Logger) echo.MiddlewareFunc {
	return middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogURI:      true,
		LogStatus:   true,
		LogError:    true,
		HandleError: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			if v.Error == nil {
				logger.WithFields(logrus.Fields{
					"uri":    v.URI,
					"status": v.Status,
				}).Info("request")
			} else {
				logger.WithFields(logrus.Fields{
					"err":    v.Error.Error(),
					"status": v.Status,
					"uri":    v.URI,
				}).Error("request")
			}

			return nil
		},
	})
}
