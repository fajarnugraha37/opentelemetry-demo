# Load Testing with k6

This directory contains k6 load testing scripts for the microservices application.

## Prerequisites

1. Install k6: https://k6.io/docs/getting-started/installation

## Running the Tests

To run the load tests:

```bash
k6 run load-test.js
```

## Test Scenarios

The load test includes two scenarios:

1. Normal Flow Test:
   - Ramps up to 50 virtual users over 2 minutes
   - Maintains 50 users for 5 minutes
   - Ramps down to 0 users over 2 minutes

2. Stress Test:
   - Starts after the normal flow completes
   - Ramps up to 100 virtual users over 2 minutes
   - Maintains 100 users for 5 minutes
   - Ramps down to 0 users over 2 minutes

## Thresholds

- 95% of all requests should complete within 500ms
- 95% of order requests should complete within 1000ms
- Error rate should be below 10%

## Metrics Collected

- HTTP request duration
- Error rates
- Custom metrics per endpoint type (order, inventory, payment)

## Test Flow

Each virtual user:
1. Checks inventory availability
2. Creates an order
3. Processes payment for the order
4. Includes random sleep times between requests