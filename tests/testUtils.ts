import {expect} from "playwright-test-coverage";

class User {
    email: string
    password: string
    name: string
    id: number
    constructor(email: string, password: string, name: string, id: number) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.id = id;
    }
}

async function login (page, user: User, role: string) {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: user.email, password: user.password};
        const loginRes = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: [{ role: role }],
            },
            token: 'abcdef',
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    }
)}

async function franchiseeLogin (page, user: User) {
    await page.route('*/**/api/auth', async (route) => {
            const loginReq = { email: user.email, password: user.password};
            const loginRes = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
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
        }
)}

async function logout (page) {
    await page.route('*/**/api/auth', async (route) => {
        const logoutRes = { message: "logout successful" };
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: logoutRes });
    }
)}

async function franchiseePageMockApi(page) {
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
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseeRes });
    }
)}

async function franchiseePageNewStoreMockApi(page) {
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
                            totalRevenue: 3.983
                        },
                        {
                            id: 2,
                            name: "testStore",
                            totalRevenue: 0
                        }
                    ]
                }
            ];
            expect(route.request().method()).toBe('GET');
            await route.fulfill({ json: franchiseeRes });
    }
)}

async function menuMockApi(page) {
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
    }
)}

async function checkoutMockApi(page) {
    await page.route('*/**/api/user/*', async (route) => {
        const userRes = {
            id: 9,
            name: "testUser1",
            email: "test@test.test",
            roles: [],
            iat: 1759435763
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: userRes });
    }
)}

async function payMockApi(page) {
    await page.route('*/**/api/order', async (route) => {
        const orderReq = route.request().postDataJSON();
        const orderRes = {
            order: { ...orderReq, id: 23 },
            jwt: 'eyJpYXQ',
        };
        expect(route.request().method()).toBe('POST');
        await route.fulfill({ json: orderRes });
    }
)}

async function createStoreMockApi(page) {
    await page.route('*/**/api/franchise/1/store', async (route) => {
        const storeReq = {id: "", name: "testStore"};
        const userRes = {
            id: 2,
            franchiseId: 1,
            name: "testStore"
        };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(storeReq);
        await route.fulfill({ json: userRes });
    }
)}

async function deleteStoreMockApi(page) {
    await page.route('*/**/api/franchise/1/store/2', async (route) => {
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: { message: "Store deleted" } });
    }
)}

async function adminFranchiseMockApi(page) {
    await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
        const franchiseRes = {
            franchises: [
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
                            totalRevenue: 3.983
                        }
                    ]
                }
            ],
            more: false
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    }
)}

async function adminNewFranchiseMockApi(page) {
    await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
            const franchiseRes = {
                franchises: [
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
                                totalRevenue: 3.983
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: "testFranchise",
                        admins: [
                            {
                                id: 1,
                                name: "常用名字",
                                email: "a@jwt.com"
                            }
                        ],
                        stores: []
                    }
                ],
                more: false
            };
            expect(route.request().method()).toBe('GET');
            await route.fulfill({ json: franchiseRes });
        }
    )}

async function createFranchiseMockApi(page) {
    await page.route('*/**/api/franchise', async (route) => {
        const franchiseReq = {
            stores: [],
            id: 2,
            name: "testFranchise",
            admins: [
                {
                    email: "a@jwt.com",
                    id: 1,
                    name: "常用名字"
                }
            ]
        };
        expect(route.request().method()).toBe('POST');
        await route.fulfill({ json: franchiseReq });
    }
)}

async function deleteFranchiseMockApi(page) {
    await page.route('*/**/api/franchise/2', async (route) => {
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: { message: "Franchise deleted" } });
    }
)}

async function dinerFranchiseMockApi(page) {
    await page.route('*/**/api/franchise?page=0&limit=20&name=*', async (route) => {
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
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    }
)}


export { User, login, logout, franchiseeLogin,
    franchiseePageMockApi, menuMockApi, checkoutMockApi, payMockApi,
    createStoreMockApi, deleteStoreMockApi, franchiseePageNewStoreMockApi,
    adminFranchiseMockApi, createFranchiseMockApi, adminNewFranchiseMockApi,
    deleteFranchiseMockApi,dinerFranchiseMockApi,};