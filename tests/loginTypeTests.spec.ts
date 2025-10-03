import { test, expect } from 'playwright-test-coverage';
import {User, login, logout, franchiseeLogin, franchiseePageMockApi} from './testUtils';

test('login and logout as diner', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    //login mock api
    const dinerUser = new User('test@test.test','testing123','testUser1',9);
    await login(page, dinerUser, 'diner');

    //login
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('test@test.test');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('testing123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 't', exact: true })).toBeVisible();
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

    //logout mock api
    await page.unroute('*/**/api/auth');
    await logout(page);

    //logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
})

test('login and logout as admin', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByText('JWT Pizza', { exact: true })).toBeVisible();

    //login mock api
    const adminUser = new User('a@jwt.com', 'admin', '常用名字', 1);
    await login(page, adminUser, 'admin');

    //login
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    //check admin page
    await expect(page.getByRole('link', { name: '常' })).toBeVisible();
    await page.getByRole('link', { name: '常' }).click();
    await expect(page.getByText('admin', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByText('Mama Ricci\'s kitchen', { exact: true })).toBeVisible();

    //logout mock api
    await page.unroute('*/**/api/auth');
    await logout(page);

    //logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
})

test('login and logout as franchisee', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByText('JWT Pizza', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();

    //login api mock
    const franchiseeUser = new User('f@jwt.com', 'franchisee', 'pizza franchisee', 3);
    await franchiseeLogin(page, franchiseeUser);

    //login
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
    await page.getByRole('button', { name: 'Login' }).click();

    //check franchisee page mock api
    await franchiseePageMockApi(page);

    //check account and franchisee page
    await expect(page.getByRole('link', { name: 'pf' })).toBeVisible();
    await page.getByRole('link', { name: 'pf' }).click();
    await expect(page.getByText('Franchisee on 1')).toBeVisible();
    await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByText('pizzaPocket')).toBeVisible();
    await expect(page.getByText('Everything you need to run an')).toBeVisible();

    //logout mock api
    await page.unroute('*/**/api/auth');
    await logout(page);

    //logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
})