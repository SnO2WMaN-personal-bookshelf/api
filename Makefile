ENV_LOCAL_FILE := .env
ENV_LOCAL = $(shell cat $(ENV_LOCAL_FILE))

.PHONY: dc-up-local
dc-up-local:
	$(ENV_LOCAL) docker-compose \
    -f docker/docker-compose.deps.base.yml \
    -f docker/docker-compose.deps.local.yml \
    -p local up -d -V

.PHONY: dc-down-local
dc-down-local:
	$(ENV_LOCAL) docker-compose \
    -f docker/docker-compose.deps.base.yml \
    -f docker/docker-compose.deps.local.yml \
    -p local down
