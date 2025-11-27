start: 
	docker compose up -d --build

down: 
	docker compose down -v

prune :
	docker system prune -a --volumes -f

re: down prune start

.PHONY: start down