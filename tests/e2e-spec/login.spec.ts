import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

const INVALID_CREDENTIALS_ERROR = 'Логін або пароль введено невірно!';

let userCredentials = {
    login: `test_user_${Date.now()}`,
    password: 'password123',
    password2: 'password123',
};

test.describe('Login Page UI Tests', () => {
    test.beforeAll(async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/signup`, {
            data: {
                login: userCredentials.login,
                password: userCredentials.password,
                password2: userCredentials.password2,
            },
        });
        console.log('Test user creation response status:', response.status(), 'username:', userCredentials.login);
    });
    test('should log in successfully with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.enterLogin(userCredentials.login);
        await loginPage.enterPassword(userCredentials.password);
        await loginPage.clickLoginButton();

        await expect(page).toHaveURL('/home');
    });

    test('should show error message for invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.enterLogin('invalid_user');
        await loginPage.enterPassword('wrong_password');
        await loginPage.clickLoginButton();

        await expect(loginPage.getErrorMessage()).toHaveText(INVALID_CREDENTIALS_ERROR);    });
});