const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Run sequentially to avoid resource contention
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Set to 1 worker for stable sequential local execution
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
    headless: true,
    launchOptions: {
      // Làm chậm các thao tác nhập liệu/click chuột (slowMo) đi 100ms để chạy nhanh hơn
      // Giúp người dùng quan sát quá trình tự động điền số nhanh hơn, rút ngắn thời gian chạy
      slowMo: 100,
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
