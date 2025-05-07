import { test, expect } from '@playwright/test';
import { loginAndSetCookies } from '../helpers/auth.helpers';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';

test.describe('Login Page UI Tests', () => {
    let userCredentials: { login: string; password: string; password2: string };

    test.beforeEach(async ({ page, request, baseURL }) => {
        userCredentials = {
            login: `test_user_${Date.now()}`,
            password: 'password123',
            password2: 'password123',
        };

        const signupResponse = await request.post(`${baseURL}/signup`, {
            data: userCredentials,
        });
        console.log('Test user creation response status:', signupResponse.status(), 'username:', userCredentials.login);

        await loginAndSetCookies(request, page, baseURL, userCredentials);
    });

    test('should verify the home page', async ({ page }) => {
        const homePage = new HomePage(page);
        await page.goto('/home');

        await expect(page).toHaveURL('/home');
        expect(await homePage.isLogoutButtonVisible()).toBe(true);
        expect(await homePage.getGreetingMessage()).toBe(`Hello ${userCredentials.login}`);
    });

    test('should logout successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        await page.goto('/home');
        await homePage.clickLogoutButton();

        await expect(page).toHaveURL('/login');
        await expect(loginPage.getPageTitle()).toHaveText('Авторизація');
    });
});