# OpenTelemetry Demo

Welcome to the OpenTelemetry Demo repository! This project demonstrates how to implement OpenTelemetry for observability. It showcases various features such as tracing, metrics, and logging.

## Table of Contents

- [OpenTelemetry Demo](#opentelemetry-demo)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Distributed Tracing**: Capture and visualize traces across services.
- **Metrics Collection**: Gather and analyze performance metrics.
- **Logging Integration**: Integrate logs.
- **Example Applications**: Sample applications demonstrating OpenTelemetry.

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
3. 
    ```bash
    For my use I have created a postman collection for the api exposed here (https://github.com/fajarnugraha37/opentelemetry-demo/blob/main/load-test/demo.postman_collection.json)[demo.postman_collection.json]
    Or you can use k6 for load testing by using the command below:
    k6 run .\load\k6\index.js 
    ```
    **NOTE**: details of the available tests can be read here (https://github.com/fajarnugraha37/opentelemetry-demo/blob/main/load-test/k6/README.md)[README.md]


## Contributing

Contributions are welcome! Please read our CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details. For more information on OpenTelemetry, check out the official OpenTelemetry documentation.
Feel free to modify any sections or add specific details related to your project that may not be covered.