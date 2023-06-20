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

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, from, entry.From)
		assert.Equal(t, to, entry.To)
		assert.Equal(t, float64(255), entry.Distance)
		t.Log(entry)

		query.Measurement.Where(query.Measurement.ID.Eq(entry.ID)).Delete()
	})

	t.Run("GET /:id", func(t *testing.T) {
		var (
			from       = models.Color{R: 0, G: 0, B: 0}
			to         = models.Color{R: 1, G: 1, B: 1}
			setupEntry = &models.Measurement{
				From:     from,
				To:       to,
				Distance: 255,
			}
		)
		if err := query.Measurement.Create(setupEntry); err != nil {
			t.Errorf("Failed to create setup measurement %v", err)
		}

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", fmt.Sprintf("/v1/measurements/%d", setupEntry.ID), nil)
		router.ServeHTTP(w, req)

		if err := json.Unmarshal(w.Body.Bytes(), setupEntry); err != nil {
			t.Error(err)
		}

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, models.Color{R: 0, G: 0, B: 0}, setupEntry.From)
		assert.Equal(t, models.Color{R: 1, G: 1, B: 1}, setupEntry.To)
		assert.Equal(t, float64(255), setupEntry.Distance)

		query.Measurement.Where(query.Measurement.ID.Eq(setupEntry.ID)).Delete()

		t.Log(setupEntry)
	})

	t.Run("PATCH /:id", func(t *testing.T) {
		w := httptest.NewRecorder()
		var (
			from         = models.Color{R: 31, G: 41, B: 59}
			to           = models.Color{R: 26, G: 53, B: 58}
			setupEntry   = &models.Measurement{}
			desiredEntry = &models.Measurement{
				From:     from,
				To:       to,
				Distance: 97,
			} // digits of pi
		)
		payload, _ := json.Marshal(desiredEntry)

		if err := query.Measurement.Create(setupEntry); err != nil {
			t.Errorf("Failed to create setup measurement %v", err)
		}

		req, _ := http.NewRequest("PATCH", fmt.Sprintf("/v1/measurements/%d", setupEntry.ID), bytes.NewReader(payload))
		router.ServeHTTP(w, req)

		if err := json.Unmarshal(w.Body.Bytes(), desiredEntry); err != nil {
			t.Error(err)
		}

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Equal(t, from, desiredEntry.From)
		assert.Equal(t, to, desiredEntry.To)
		assert.Equal(t, float64(97), desiredEntry.Distance)
		t.Log(desiredEntry)

		query.Measurement.Where(query.Measurement.ID.Eq(setupEntry.ID)).Delete()
	})

	t.Run("DELETE /:id", func(t *testing.T) {
		w := httptest.NewRecorder()
		setupEntry := &models.Measurement{}

		if err := query.Measurement.Create(setupEntry); err != nil {
			t.Errorf("Failed to create setup measurement %v", err)
		}

		req, _ := http.NewRequest("DELETE", fmt.Sprintf("/v1/measurements/%d", setupEntry.ID), nil)
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("GET /:id not found", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/v1/measurements/1", nil)
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusBadRequest, w.Code)
	}) // only testing GET badrequest branch for brevity
}
