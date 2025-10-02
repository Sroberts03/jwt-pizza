import { test, expect } from 'playwright-test-coverage';

test('order pizza' , async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

    //login mock api
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'test@test.test', password: 'testing123' };
        const loginRes = {
            user: {
                id: 9,
                name: 'testUser1',
                email: 'test.test.test',
                roles: [],
            },
            token: 'abcdef',
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });

    //login
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('test@test.test');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('testing123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

    //order mock api
    await page.route('*/**/api/order/menu', async (route) => {
        const menuRes = [
            {
                id: 1,
                title: 'Veggie',
                image: 'pizza1.png',
                price: 0.0038,
                description: 'A garden of delight',
            },
            {
                id: 2,
                title: 'Pepperoni',
                image: 'pizza2.png',
                price: 0.0042,
                description: 'Spicy treat',
            },
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: menuRes });
    });

    //franchise mock api
    await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
        const franchiseRes = {
            franchises: [
            {
            id: 1,
            name: "pizzaPocket",
            stores: [
            {
            id: 1,
            name: "SLC"
            }
          ]
        }
      ],
      more: false
    }
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });

    //order
    await page.getByRole('link', { name: 'Order' }).click();
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');

    //checkout mock api
    await page.route('*/**/api/user/*', async (route) => {
       const userRes = {
      id: 9,
      name: "testUser1",
      email: "test@test.test",
      roles: [],
      iat: 1759435763
    }
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: userRes });
    });

    //checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.getByRole('heading')).toContainText('So worth it');
    await expect(page.getByRole('cell', { name: 'Veggie' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Pepperoni' })).toBeVisible();

    //pay mock api
    await page.route('*/**/api/order', async (route) => {
        const orderReq = route.request().postDataJSON();
        const orderRes = {
            order: { ...orderReq, id: 23 },
            jwt: 'eyJpYXQ',
        };
        expect(route.request().method()).toBe('POST');
        await route.fulfill({ json: orderRes });
    });

    //pay
    await page.getByRole('button', { name: 'Pay now' }).click();
    await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();

    //logout mock api
    await page.unroute('*/**/api/auth');
    await page.route('*/**/api/auth', async (route) => {
        const logoutRes = { message: "logout successful" };
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: logoutRes });
    });

    //logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
});
