package controllers_test

import (
	"backend/models"
	"backend/query"
	"backend/server"
	"fmt"

	"bytes"
	"encoding/json"
	"os"

	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestMain(m *testing.M) {
	conn, _ := gorm.Open(sqlite.Open(":memory:"))
	query.SetDefault(conn)
	conn.AutoMigrate(models.AllModels...)
	os.Exit(m.Run())
}

func TestMeasurementsController(t *testing.T) {
	router := server.NewRouter()

	t.Run("GET /", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/v1/measurements/", nil)
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("POST /", func(t *testing.T) {
		w := httptest.NewRecorder()
		// You're repeating the definition of From/To in both the request
		// and the assertion body itself. I would recommend doing something
		// like this instead:
		var (
			from  = models.Color{R: 0, G: 0, B: 0}
			to    = models.Color{R: 1, G: 1, B: 1}
			entry = &models.Measurement{
				From:     from,
				To:       to,
				Distance: 255,
			}
		)

		payload, _ := json.Marshal(entry)
		req, _ := http.NewRequest("POST", "/v1/measurements/", bytes.NewReader(payload))
		router.ServeHTTP(w, req)

		if err := json.Unmarshal(w.Body.Bytes(), entry); err != nil {
			t.Error(err)
		}

		// ...so that you only have to update one spot when those values change
		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, from, entry.From)
		assert.Equal(t, to, entry.To)
		assert.Equal(t, float64(255), entry.Distance)
		t.Log(entry)
	})

	// This test assumes it is always run after `POST /`
	// and that may not necessarily always be true. Each
	// test should (ideally) manage its own setup and teardown
	t.Run("GET /:id", func(t *testing.T) {
		// Since this is pure Go application code you can run
		// ORM queries directly to pre-seed your database
		var (
			from  = models.Color{R: 0, G: 0, B: 0}
			to    = models.Color{R: 1, G: 1, B: 1}
			entry = &models.Measurement{
				From:     from,
				To:       to,
				Distance: 255,
			}
		)
		if err := query.Measurement.Create(entry); err != nil {
			t.Errorf("Failed to create measurement %v", err)
		}

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", fmt.Sprintf("/v1/measurements/%d", entry.ID), nil)
		router.ServeHTTP(w, req)

		if err := json.Unmarshal(w.Body.Bytes(), entry); err != nil {
			t.Error(err)
		}

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, models.Color{R: 0, G: 0, B: 0}, entry.From)
		assert.Equal(t, models.Color{R: 1, G: 1, B: 1}, entry.To)
		assert.Equal(t, float64(255), entry.Distance)

		query.Measurement.Where(query.Measurement.ID.Eq(entry.ID)).Delete()

		t.Log(entry)
	})

	t.Run("PATCH /:id", func(t *testing.T) {
		w := httptest.NewRecorder()
		entry := &models.Measurement{
			From:     models.Color{R: 31, G: 41, B: 59},
			To:       models.Color{R: 26, G: 53, B: 58},
			Distance: 97,
		} // digits of pi
		payload, _ := json.Marshal(entry)

		req, _ := http.NewRequest("PATCH", "/v1/measurements/1", bytes.NewReader(payload))
		router.ServeHTTP(w, req)

		if err := json.Unmarshal(w.Body.Bytes(), entry); err != nil {
			t.Error(err)
		}

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, models.Color{R: 31, G: 41, B: 59}, entry.From)
		assert.Equal(t, models.Color{R: 26, G: 53, B: 58}, entry.To)
		assert.Equal(t, float64(97), entry.Distance)
		t.Log(entry)
	})

	// Same note about test order dependency
	t.Run("DELETE /:id", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("DELETE", "/v1/measurements/1", nil)
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusOK, w.Code)
	})

	// Same note about test order dependency
	t.Run("GET /:id not found", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/v1/measurements/1", nil)
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusBadRequest, w.Code)
	}) // only testing GET badrequest branch for brevity
}
