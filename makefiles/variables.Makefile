CURRENT_DIR := $(patsubst %/,%, $(dir $(realpath $(firstword $(MAKEFILE_LIST)))))
APP_DIR := app
NODE_ENV := development

_DC_PLUGIN := $(shell docker compose version >/dev/null 2>&1 && echo 1 || echo 0)
ifeq ($(_DC_PLUGIN),1)
	DOCKER_COMPOSE := docker compose
else
	DOCKER_COMPOSE := docker-compose
endif

SERVICE        := resume
CONTAINER_NAME := resume-dev
IMAGE          := ghcr.io/chrysa/resume
PORT           := 3000

EXEC   := $(DOCKER_COMPOSE) exec $(SERVICE)
RUN    := COMPOSE_PROFILES=dev $(DOCKER_COMPOSE) run --rm $(SERVICE)
RUN_IT := COMPOSE_PROFILES=dev $(DOCKER_COMPOSE) run --rm -it $(SERVICE)

NPM      := $(RUN) env HUSKY=0 npm
NPM_EXEC := $(EXEC) env HUSKY=0 npm

COLOR_RESET  := \033[0m
COLOR_BLUE   := \033[36m
COLOR_GREEN  := \033[32m
COLOR_YELLOW := \033[33m
COLOR_RED    := \033[31m

_SERVICE_START       = COMPOSE_PROFILES=dev $(DOCKER_COMPOSE) up -d $(SERVICE)
_SERVICE_STOP        = $(DOCKER_COMPOSE) stop $(SERVICE) 2>/dev/null || true
_SERVICE_REMOVE      = $(DOCKER_COMPOSE) rm -f $(SERVICE) 2>/dev/null || true
_SERVICE_LOGS        = $(DOCKER_COMPOSE) logs $(SERVICE)
_SERVICE_LOGS_FOLLOW = $(DOCKER_COMPOSE) logs -f $(SERVICE)
