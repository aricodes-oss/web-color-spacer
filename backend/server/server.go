package server

import (
	"fmt"
	"os"
)

func port() string {
	raw, present := os.LookupEnv("PORT")
	if !present {
		return ":3000"
	}
	return fmt.Sprintf(":%s", raw)
}

func Init() {
	r := NewRouter()
	r.Run(port())
}
