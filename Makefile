dbuild:
	- docker image rm otel-demo/$(service):latest 
	docker build \
		--no-cache \
		--progress=plain \
		-t otel-demo/$(service) \
		-f services/$(service)/Dockerfile .

drun:
	docker run -it --rm \
		-p $(port):$(port) \
		--env-file .env.service \
		otel-demo/$(service)

dcleanup:
	- docker container rm otel-nginx-1
	- docker container rm otel-order-1
	- docker container rm otel-payment-1
	- docker container rm otel-inventory-1
	- docker container rm otel-grafana-1
	- docker container rm otel-otel-collector-1
	- docker container rm otel-kafka-1
	- docker container rm otel-loki-1
	- docker container rm otel-jaeger-1
	- docker container rm otel-prometheus-1
	- docker container rm otel-promtail-1
	- docker image rm otel-demo/payment:latest
	- docker image rm otel-demo/order:latest
	- docker image rm otel-demo/inventory:latest
	- docker image rm otel-payment:latest
	- docker image rm otel-order:latest
	- docker image rm otel-inventory:latest
	- docker volume prune
	- docker volume rm otel_loki_data
	- docker volume rm otel_nginx_logs

nbuild:
	npm run build --workspace=services/$(service)

ndev:
	npm run dev --workspace=services/$(service)

ninstall:
	npm install $(deps) --workspace=services/$(service)
	
ninstall.dev:
	npm install -D $(deps) --workspace=services/$(service)

up:
	docker compose up --force-recreate -V

down:
	docker compose down
	make dcleanup