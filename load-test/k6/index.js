import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

// Test configuration
export const options = {
    scenarios: {
        // Common flow test
        normal_flow: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 50 },  // Ramp up to 50 users
                { duration: '5m', target: 50 },  // Stay at 50 users
                { duration: '2m', target: 0 },   // Ramp down to 0 users
            ],
            gracefulRampDown: '30s',
        },
        // Stress test
        stress_test: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 100 }, // Ramp up to 100 users
                { duration: '5m', target: 100 }, // Stay at 100 users
                { duration: '2m', target: 0 },   // Ramp down to 0 users
            ],
            gracefulRampDown: '30s',
            startTime: '10m',                  // Start after normal_flow completes
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        'http_req_duration{type:order}': ['p(95)<1000'],  // Orders can take longer
        errors: ['rate<0.1'],  // Error rate should be below 10%
    },
};

const BASE_URL = 'http://localhost';

// Helper function to generate random items
function getRandomItems() {
    const items = ['item1', 'item2', 'item3'];
    const numItems = Math.floor(Math.random() * 2) + 1; // 1 or 2 items
    const result = [];

    for (let i = 0; i < numItems; i++) {
        result.push({
            id: items[Math.floor(Math.random() * items.length)],
            quantity: Math.floor(Math.random() * 3) + 1, // 1-3 items
        });
    }

    return result;
}

export default function () {
    // Check inventory
    const inventoryCheck = http.post(
        `${BASE_URL}/api/inventory/check-inventory`,
        JSON.stringify({ items: getRandomItems() }),
        { tags: { type: 'inventory' } }
    );

    check(inventoryCheck, {
        'inventory check status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);

    sleep(1);

    // Create order
    const orderItems = getRandomItems();
    const createOrder = http.post(
        `${BASE_URL}/api/orders`,
        JSON.stringify({ items: orderItems }),
        { tags: { type: 'order' } }
    );

    check(createOrder, {
        'create order status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);

    if (createOrder.status === 200) {
        const orderData = JSON.parse(createOrder.body);

        // Process payment
        const processPayment = http.post(
            `${BASE_URL}/api/payment/process`,
            JSON.stringify({
                orderId: orderData.orderId,
                amount: 100 * orderItems.length, // Dummy calculation
            }),
            { tags: { type: 'payment' } }
        );

        check(processPayment, {
            'process payment status is 200': (r) => r.status === 200,
        }) || errorRate.add(1);
    }

    sleep(2);
}