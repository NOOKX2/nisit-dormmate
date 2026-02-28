import { test, expect } from '@playwright/test';

test.describe('Dorm Creation Flow', () => {
  test('ควรจะสร้างหอพักใหม่และแสดงผลในหน้าลิสต์ได้ถูกต้อง', async ({ page }) => {
    // 1. ไปที่หน้าเพิ่มหอพัก (สมมติว่าอยู่ที่ /admin/add-dorm)
    await page.goto('/admin/add-dorm');

    // 2. กรอกข้อมูลหอพัก
    await page.fill('input[name="name"]', 'หอพักทดสอบ Playwright');
    await page.fill('input[name="locationShort"]', 'ซอยทดสอบ 101');
    await page.fill('input[name="basePrice"]', '5000');
    await page.fill('textarea[name="description"]', 'หอพักนี้สร้างโดยการรัน automated test');

    // 3. กดปุ่มสร้าง
    await page.click('button[type="submit"]');

    // 4. รอให้ Toast แสดงผลสำเร็จ (ถ้าใช้ Sonner)
    await expect(page.locator('text=สร้างหอพักและห้องพักสำเร็จ!')).toBeVisible();

    // 5. ตรวจสอบว่าระบบ Redirect ไปหน้า /dorm หรือไม่
    await expect(page).toHaveURL('/dorm');

    // 6. เช็กว่าชื่อหอพักใหม่ปรากฏบนหน้าจอลิสต์หอพัก
    await expect(page.locator('text=หอพักทดสอบ Playwright')).toBeVisible();
  });
});