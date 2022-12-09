package main

import (
	"chatgpt/api"
	"chatgpt/config"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Message struct {
	Msg string `json:"msg"`
}

func ChatGPTPost(c *gin.Context) {
	m := Message{}
	_ = c.BindJSON(&m)
	retMsg, _ := api.Completions(m.Msg)
	fmt.Printf("\nmsg: %s\nretMsg: %s\n", m.Msg, retMsg)
	c.JSON(http.StatusOK, gin.H{"msg": m.Msg, "retMsg": retMsg})

}
func ChatGPTGet(c *gin.Context) {

	msg := c.Query("msg")

	if msg == "" {
		c.String(http.StatusOK, "问题不能为空哦")
	}
	retMsg, _ := api.Completions(msg)
	fmt.Printf("\nmsg: %s\nretMsg: %s\n", msg, retMsg)
	c.String(http.StatusOK, retMsg)

}

func main() {
	gin.DisableConsoleColor()
	gin.SetMode(gin.ReleaseMode)
	app := gin.New()
	app.POST("/", ChatGPTPost)
	app.GET("/", ChatGPTGet)
	port := config.Get("PORT")
	fmt.Printf("Port: %s\n", port)
	_ = app.Run(port)
}
