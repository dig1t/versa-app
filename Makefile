DOCKER_USERNAME ?= dig1t
APPLICATION_NAME ?= versa

build-image:
	docker build --target development --tag dig1t/versa .

run-image:
	docker run -it --rm --name versa -p 8080:8080 versa

dev-image:
	docker run -it --rm --name versa -p 8080:8080

up-dev:
	docker compose up --build
