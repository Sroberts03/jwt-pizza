import { test, expect } from 'playwright-test-coverage';

test('test', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('navigation', { name: 'Global' })).toBeVisible();
    await expect(page.locator('.w-screen')).toBeVisible();
    await page.getByRole('button', { name: 'Order now' }).click();
    await expect(page.locator('form div').first()).toBeVisible();
});

