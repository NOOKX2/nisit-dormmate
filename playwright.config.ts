import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // 👈 บอกให้ Playwright รู้ว่าไฟล์ test อยู่โฟลเดอร์ไหน
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000', // 👈 จุดที่ทำให้ page.goto('/') ทำงานได้
    trace: 'on-first-retry',
  },
  // รันเฉพาะ Chromium (Chrome) เพื่อความเร็วในช่วง Hackathon
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});