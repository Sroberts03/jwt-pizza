import { test, expect } from 'playwright-test-coverage';

test('login and logout as diner', async ({ page }) => {
    await page.goto('http://localhost:5173/');

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
    await page.route('*/**/api/auth', async (route) => {
        const logoutRes = { message: "logout successful" };
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: logoutRes });
    })

    //logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
})

test('login and logout as admin', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByText('JWT Pizza', { exact: true })).toBeVisible();

    //login mock api
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'a@jwt.com', password: 'admin' };
        const loginRes = {
            user: {
                id: 1,
                name: '常用名字',
                email: 'a@jwt.com',
                roles: [{ role: 'admin' }],
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
    await page.route('*/**/api/auth', async (route) => {
        const logoutRes = { message: "logout successful" };
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: logoutRes });
    })

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
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'f@jwt.com', password: 'franchisee' };
        const loginRes = {
            user:
                {
                id: 3,
                name: 'pizza franchisee',
                email: 'f@jwt.com',
                roles: [
                    { role: 'diner' },
                    { objectId: 1, role: 'franchisee' }
                    ],
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
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
    await page.getByRole('button', { name: 'Login' }).click();

    //check franchisee page mock api
    await page.route('*/**/api/franchise/3', async (route) => {
        const franchiseeRes = [
            {
                id: 1,
                name: "pizzaPocket",
                admins: [
                    {
                    id: 3,
                    name: "pizza franchisee",
                    email: "f@jwt.com"
                    }
                ],
                stores: [
                    {
                    id: 1,
                    name: "SLC",
                    totalRevenue: 3.9055
                    }
                ]
            }
        ]
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseeRes });
    })

    //check order page mock api
    await page.route('*/**/api/order', async (route) => {
        const franchiseeRes =
            {
            dinerId: 3,
            orders: [],
            page: 1
            }
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseeRes });
    })

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
    await page.route('*/**/api/auth', async (route) => {
        const logoutRes = { message: "logout successful" };
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: logoutRes });
    })

    //logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
})