# OpenTelemetry Demo

Welcome to the OpenTelemetry Demo repository! This project demonstrates how to implement OpenTelemetry for observability using nodejs with honojs. It showcases various features such as tracing, metrics, and logging.

## Table of Contents

- [OpenTelemetry Demo](#opentelemetry-demo)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Hosts](#hosts)
  - [Getting Started](#getting-started)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Distributed Tracing**
- **Metrics Collection**
- **Logging Integration**
- **Example Applications**

## Hosts
- **Services**: localhost:80
- **Grafana**: localhost:3000
- **Jaeger**: localhost:16686

## Getting Started

To get started with this demo, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/fajarnugraha37/opentelemetry-demo.git
   cd opentelemetry-demo
   ```
2. To run the demo application, execute the following command:
    ```bash
    docker compose up
    ```
3. For usage, there is a postman collection for the api exposed here [demo.postman_collection.json](https://github.com/fajarnugraha37/opentelemetry-demo/blob/main/load-test/demo.postman_collection.json)
    Or you can use k6 for load testing by using the command below and details of the available tests can be read here [README.md](https://github.com/fajarnugraha37/opentelemetry-demo/blob/main/load-test/k6/README.md):
    ```bash
    k6 run .\load\k6\index.js 
    ```


## Contributing

Contributions are welcome! Please read our CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/fajarnugraha37/opentelemetry-demo/blob/main/LICENSE) file for details. For more information on OpenTelemetry, check out [the official OpenTelemetry documentation](https://opentelemetry.io/docs/what-is-opentelemetry/).
Feel free to modify any sections or add specific details related to your project that may not be covered.
