import { test, expect } from 'playwright-test-coverage';
import {login, logout,
    menuMockApi, checkoutMockApi, payMockApi, User, dinerFranchiseMockApi} from './testUtils';

test('order pizza' , async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

    //login mock api
    const orderUser = new User('test@test.test', 'testing123', 'testUser1', 9);
    await login(page, orderUser, 'diner');

    //login
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('test@test.test');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('testing123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

    //order mock api
    await menuMockApi(page);

    //franchise mock api
    await dinerFranchiseMockApi(page);

    //order
    await page.getByRole('link', { name: 'Order' }).click();
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');

    //checkout mock api
    await checkoutMockApi(page);

    //checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.getByRole('heading')).toContainText('So worth it');
    await expect(page.getByRole('cell', { name: 'Veggie' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Pepperoni' })).toBeVisible();

    //pay mock api
    await payMockApi(page);

    //pay
    await page.getByRole('button', { name: 'Pay now' }).click();
    await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();

    //logout mock api
    await page.unroute('*/**/api/auth');
    await logout(page);

    //logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
});
