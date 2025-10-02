import { test, expect } from 'playwright-test-coverage';

test('homepage comes up', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('navigation', { name: 'Global' })).toBeVisible();
    await expect(page.getByLabel('Global').locator('span')).toContainText('JWT Pizza');
});

test('franchise page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
    await expect(page.locator('.bg-neutral-100')).toBeVisible();
})