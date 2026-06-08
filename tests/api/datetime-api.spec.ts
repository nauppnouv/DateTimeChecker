import { test, expect } from '@playwright/test';

test.describe('Date Time Checker API Tests', () => {

  test('should return correct response for a valid date (25/5/2026)', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '25',
        month: '5',
        year: '2026'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: true,
      message: '25/5/2026 is correct date time!'
    });
  });

  test('should return correct response for an invalid date (31/11/2026)', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '31',
        month: '11',
        year: '2026'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      message: '31/11/2026 is NOT correct date time!'
    });
  });

  test('should validate leap year valid date (29/2/2024)', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '29',
        month: '2',
        year: '2024'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: true,
      message: '29/2/2024 is correct date time!'
    });
  });

  test('should validate non-leap year invalid date (29/2/2025)', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '29',
        month: '2',
        year: '2025'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      message: '29/2/2025 is NOT correct date time!'
    });
  });

  // Format checks
  test('should return error for invalid Day format', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: 'abc',
        month: '12',
        year: '2020'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      message: 'Input data for Day is incorrect format!'
    });
  });

  test('should return error for invalid Month format', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '15',
        month: 'xy',
        year: '2020'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      message: 'Input data for Month is incorrect format!'
    });
  });

  test('should return error for invalid Year format', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '15',
        month: '08',
        year: '12a'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      message: 'Input data for Year is incorrect format!'
    });
  });

  // Range checks
  test('should return error for Day out of range', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '32',
        month: '10',
        year: '2020'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      message: 'Input data for Day is out of range!'
    });
  });

  test('should return error for Month out of range', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '15',
        month: '13',
        year: '2020'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      message: 'Input data for Month is out of range!'
    });
  });

  test('should return error for Year out of range (too small)', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '15',
        month: '08',
        year: '999'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      message: 'Input data for Year is out of range!'
    });
  });

  test('should return error for Year out of range (too large)', async ({ request }) => {
    const response = await request.post('/api/check', {
      data: {
        day: '15',
        month: '08',
        year: '3001'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      message: 'Input data for Year is out of range!'
    });
  });

});
