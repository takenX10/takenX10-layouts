FROM mcr.microsoft.com/devcontainers/base:0-alpine-3.16

RUN apk add --no-cache \
	nodejs \
	docker-cli \
	docker-cli-buildx \
	docker-cli-compose \
	;
