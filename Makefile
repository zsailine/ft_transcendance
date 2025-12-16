start: 
	docker compose up -d --build

down: 
	docker compose down -v

prune :
	docker system prune -a --volumes -f

web:
	docker compose up -d --build web

gateway:
	docker compose up -d --build gateway

auth:
	docker compose up -d --build authservice

chat:
	docker compose up -d --build chatservice

online:
	docker compose up -d --build onlinepongservice

user:
	docker compose up -d --build userservice

friend:
	docker compose up -d --build friendservice

re: fclean start

fclean: down prune

.PHONY: start down prune web gateway auth chat online user friend re fclean