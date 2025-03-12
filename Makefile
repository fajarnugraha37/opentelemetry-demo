dbuild:
	- docker image rm otel-$(service):latest 
	docker build \
		--no-cache \
		--progress=plain \
		-t otel-$(service) \
		-f services/$(service)/Dockerfile .

drun:
	docker run -it --rm \
		-p $(port):$(port) \
		--env-file .env.service \
		otel-$(service)

dcleanup:
	- docker container rm opentelemetry-demo-nginx-1
	- docker container rm opentelemetry-demo-order-1
	- docker container rm opentelemetry-demo-payment-1
	- docker container rm opentelemetry-demo-inventory-1
	- docker container rm opentelemetry-demo-grafana-1
	- docker container rm opentelemetry-demo-otel-collector-1
	- docker container rm opentelemetry-demo-kafka-1
	- docker container rm opentelemetry-demo-loki-1
	- docker container rm opentelemetry-demo-jaeger-1
	- docker container rm opentelemetry-demo-prometheus-1
	- docker container rm opentelemetry-demo-promtail-1
	- docker container rm  opentelemetry-demo-node-exporter-1
	- docker container rm  opentelemetry-demo-cadvisor-1
	- docker image rm opentelemetry-demo-payment:latest
	- docker image rm opentelemetry-demo-order:latest
	- docker image rm opentelemetry-demo-inventory:latest
	- docker volume rm opentelemetry-demo_loki_data
	- docker volume rm opentelemetry-demo_nginx_logs

nbuild:
	npm run build --workspace=services/$(service)

ndev:
	npm run dev --workspace=services/$(service)

ninstall:
	npm install $(deps) --workspace=services/$(service)
	
ninstall.dev:
	npm install -D $(deps) --workspace=services/$(service)

up:
	npm run build --workspace=services/shared
	docker compose up --force-recreate -V

down:
	docker compose down
	make dcleanup
	docker volume prune