FROM mcr.microsoft.com/devcontainers/base:0-alpine-3.16

RUN apk add --no-cache \
	nodejs \
	python3 \
	npm \
	make \
	g++ \
	docker-cli \
	docker-cli-buildx \
	docker-cli-compose \
	;

RUN cd && npm i node-pty

COPY .vscode-remote-containers /root/.vscode-remote-containers
