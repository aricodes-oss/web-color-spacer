package controllers_test

import (
	"backend/db"
	"backend/models"
	"backend/query"
	"backend/server"

	"bytes"
	"encoding/json"
	"os"

	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	query.SetDefault(db.Connection)
	db.Connection.AutoMigrate(models.AllModels...)
	os.Exit(m.Run())
}

func TestMeasurementsController(t *testing.T) {
	router := server.NewRouter()

	t.Run("GET /", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/v1/measurements/", nil)
		router.ServeHTTP(w, req)
		assert.Equal(t, 200, w.Code)
	})

	t.Run("POST /", func(t *testing.T) {
		w := httptest.NewRecorder()
		entry := &models.Measurement{
			From:     models.Color{0, 0, 0},
			To:       models.Color{1, 1, 1},
			Distance: 255,
		}
		payload, _ := json.Marshal(entry)
		req, _ := http.NewRequest("POST", "/v1/measurements/", bytes.NewReader(payload))
		router.ServeHTTP(w, req)

		if err := json.Unmarshal(w.Body.Bytes(), entry); err != nil {

			t.Error(err)
		}
		assert.Equal(t, 200, w.Code)
		t.Log(entry)
	})

}
