gen: deps
	cd backend/gen && go run main.go && mv data.db ..

deps:
	cd backend && go mod tidy

test:
	docker-compose exec backend go test ./...
