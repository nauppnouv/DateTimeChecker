import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Define performance stages
  stages: [
    { duration: '10s', target: 20 }, // Ramp up to 20 users over 10 seconds
    { duration: '20s', target: 20 }, // Stay at 20 users for 20 seconds
    { duration: '10s', target: 0 },  // Ramp down to 0 users over 10 seconds
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // Less than 1% errors
    http_req_duration: ['p(95)<200'], // 95% of requests must complete under 200ms
  },
};

export default function () {
  const url = 'http://localhost:8081/api/check';
  const payload = JSON.stringify({
    day: '29',
    month: '2',
    year: '2024', // Valid leap year date
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'success is true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(0.1); // Wait 100ms between requests per virtual user
}
