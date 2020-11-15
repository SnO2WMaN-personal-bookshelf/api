COMPOSE_PATH_SEPARATOR := :

COMPOSE_FILE_LOCAL := docker/docker-compose.local.yml

ENV_LOCAL_FILE := .env
ENV_LOCAL = $(shell cat $(ENV_LOCAL_FILE)) ;\
						export COMPOSE_PROJECT_NAME=local-api ;\
						export COMPOSE_FILE=${COMPOSE_FILE_LOCAL}; \
						export COMPOSE_DOCKER_CLI_BUILD=1;\
						export DOCKER_BUILDKIT=1;

.PHONY: dc-local-build
dc-local-build:
	$(ENV_LOCAL)\
		docker-compose build --parallel

.PHONY: dc-local-rebuild
dc-local-rebuild:
	$(ENV_LOCAL)\
		docker-compose build --parallel --no-cache

.PHONY: dc-local-up
dc-local-up:
	$(ENV_LOCAL)\
		docker-compose up -d -V

.PHONY: dc-local-stop
dc-local-stop:
	$(ENV_LOCAL)\
		docker-compose stop

.PHONY: dc-local-down
dc-local-down:
	$(ENV_LOCAL)\
		docker-compose down

.PHONY: dc-local-restart
dc-local-restart:
	@make dc-local-down
	@make dc-local-up
