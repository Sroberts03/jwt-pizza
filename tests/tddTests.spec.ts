import { test, expect } from 'playwright-test-coverage';
import {User, registerMockAPI, updateUserMockAPI, logout, login, adminFranchiseMockApi, listUsersMockAPI} from './testUtils'

test('updateUser', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  const testUser = new User(email, 'diner', 'pizza diner', 3);

  await registerMockAPI(page, testUser);

  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill(testUser.name);
  await page.getByRole('textbox', { name: 'Email address' }).fill(testUser.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(testUser.password);
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza diner');

  await updateUserMockAPI(page, testUser);

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza diner');
  
  const newUser = new User(email, 'diner', 'pizza dinerx', 3);

  await page.unroute('*/**/api/user/**');
  await updateUserMockAPI(page, newUser);

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').first().fill('pizza dinerx');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza dinerx');

  await page.unroute('*/**/api/auth');
  await logout(page);

  await page.getByRole('link', { name: 'Logout' }).click();

  await page.unroute('*/**/api/auth');
  await login(page, newUser, 'diner');

  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza dinerx');
});

test('adminDashboard view users', async ({ page }) => {
  await page.goto('/');

  const adminUser = new User('admin@jwt.com', 'admin', 'Admin User', 1);
  await login(page, adminUser, 'admin');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(adminUser.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(adminUser.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await listUsersMockAPI(page);
  await adminFranchiseMockApi(page);
  
  await page.getByRole('link', { name: 'ad' }).click();
  await expect(page.getByRole('heading', { name: "Mama Ricci's kitchen" })).toBeVisible();

  await expect(page.getByRole('main')).toContainText('Users');
  await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '常用名字' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'a@jwt.com' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Admin' }).first()).toBeVisible();
});

test('adminDahsboard next and prev', async ({ page }) => {
  await page.goto('/');

  const adminUser = new User('admin@jwt.com', 'admin', 'Admin User', 1);
  await login(page, adminUser, 'admin');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(adminUser.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(adminUser.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await listUsersMockAPI(page, true);
  await adminFranchiseMockApi(page);
  
  await page.getByRole('link', { name: 'ad' }).click();
  await expect(page.getByRole('heading', { name: "Mama Ricci's kitchen" })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Prev' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('button', { name: 'Prev' })).toBeEnabled();
  await page.getByRole('button', { name: 'Prev' }).click();
  await expect(page.getByRole('button', { name: 'Prev' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('adminDashboard filter users', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.getByRole('link', { name: 'ad' }).click();
  await expect(page.getByRole('heading', { name: "Mama Ricci's kitchen" })).toBeVisible();

  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('sam roberts');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('cell', { name: 'Sam Roberts' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Sam Roberts' }).nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Prev' })).toBeDisabled();
});

test('delete user', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.getByRole('link', { name: 'ad' }).click();
  await expect(page.getByRole('heading', { name: "Mama Ricci's kitchen" })).toBeVisible();

  await expect(page.getByRole('row', { name: '常用名字 a@jwt.com Admin X' }).getByRole('button')).toBeVisible();
  // await expect(page.getByRole('main')).toContainText('user9125@jwt.com');
  await page.locator('tr:nth-child(9) > .px-6 > .px-2').click();
  await expect(page.getByText('Are you sure you want to')).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Are you sure you want to')).not.toBeVisible();
});