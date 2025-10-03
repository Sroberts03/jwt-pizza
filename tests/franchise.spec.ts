import { test, expect } from 'playwright-test-coverage';
import {User, login, franchiseeLogin, logout,
    franchiseePageMockApi, createStoreMockApi, deleteStoreMockApi,
    franchiseePageNewStoreMockApi} from './testUtils';

test('create and close store', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

    //login mock api
    const franchiseeUser = new User('f@jwt.com', 'franchisee', 'pizza franchisee', 3);
    await franchiseeLogin(page, franchiseeUser);

    //login
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
    await page.getByRole('button', { name: 'Login' }).click();

    //franchisee page mock api
    await franchiseePageMockApi(page);

    //check account and franchisee page
    await expect(page.getByRole('link', { name: 'pf' })).toBeVisible();
    await page.getByRole('link', { name: 'pf' }).click();
    await expect(page.getByText('Franchisee on 1')).toBeVisible();
    await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByText('pizzaPocket')).toBeVisible();
    await expect(page.getByText('Everything you need to run an')).toBeVisible();

    //create store mock api
    await createStoreMockApi(page);

    //new store api mock
    await page.unroute('*/**/api/franchise/3');
    await franchiseePageNewStoreMockApi(page);

    //create store
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByRole('textbox', { name: 'store name' }).click();
    await page.getByRole('textbox', { name: 'store name' }).fill('testStore');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('cell', { name: 'testStore' })).toBeVisible();

    //delete store mock api
    await deleteStoreMockApi(page);

    //back to franchisee page with no new store
    await page.unroute('*/**/api/franchise/3');
    await franchiseePageMockApi(page);

    //close store
    await page.getByRole('row', { name: 'testStore 0 ₿ Close' }).getByRole('button').click();
    await expect(page.getByText('Sorry to see you go')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('pizzaPocketEverything you')).toBeVisible();

    //logout mock api
    await page.unroute('*/**/api/auth');
    await logout(page);

    //logout
    await page.getByRole('link', { name: 'Logout' }).click();
})

test('create franchise and close franchise', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

    //login mock api
    // const adminUser = new User('a@jwt.com', 'admin', 1, '常用名字');
    // await login(page, adminUser, 'admin');

    //login
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

    //add franchise
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.locator('h2')).toContainText('Mama Ricci\'s kitchen');
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).fill('testFranchise');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('cell', { name: 'testFranchise' })).toBeVisible();

    //close franchise
    await page.getByRole('row', { name: 'testFranchise 常用名字 Close' }).getByRole('button').click();
    await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('FranchisesFranchiseFranchiseeStoreRevenueActionpizzaPocketpizza franchisee')).toBeVisible();

    //logout mock api
    // await logout(page);

    //logout
    await page.getByRole('link', { name: 'Logout' }).click();
})