import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/signup.page';
import { LoginPage } from "../pages/login.page";
import {HomePage} from "../pages/home.page";

test.describe('Signup Page UI Tests', () => {
    let userCredentials: { login: string; password: string; password2: string };

    test.beforeEach(() => {
        userCredentials = {
            login: `test_user_${Date.now()}`,
            password: 'password123',
            password2: 'password123',
        };
    });

    test('should create a user successfully with valid data', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        const signupPage = new SignupPage(page);

        await signupPage.navigate();
        await signupPage.enterLogin(userCredentials.login);
        await signupPage.enterPassword(userCredentials.password);
        await signupPage.enterConfirmPassword(userCredentials.password2);
        await signupPage.clickCreateUserButton();

        await expect(page).toHaveURL('/login');

        await loginPage.enterLogin(userCredentials.login);
        await loginPage.enterPassword(userCredentials.password);
        await loginPage.clickLoginButton();

        await expect(page).toHaveURL('/home');
        expect(await homePage.getGreetingMessage()).toBe(`Hello ${userCredentials.login}`);

    });

    test('should show error when passwords do not match', async ({ page }) => {
        const signupPage = new SignupPage(page);

        await signupPage.navigate();
        await signupPage.enterLogin(userCredentials.login);
        await signupPage.enterPassword(userCredentials.password);
        await signupPage.enterConfirmPassword('wrong_password');
        await signupPage.clickCreateUserButton();

        await expect(signupPage.getErrorMessage()).toHaveText('В одному з полів введено невірні дані!');
    });

    test('should show error when login is empty', async ({ page }) => {
        const signupPage = new SignupPage(page);

        await signupPage.navigate();
        await signupPage.enterLogin('');
        await signupPage.enterPassword(userCredentials.password);
        await signupPage.enterConfirmPassword(userCredentials.password2);
        await signupPage.clickCreateUserButton();

        await expect(signupPage.getErrorMessage()).toHaveText('В одному з полів введено невірні дані!');
    });

    test('should navigate to login page when login button is clicked', async ({ page }) => {
        const signupPage = new SignupPage(page);
        const loginPage = new LoginPage(page);

        await signupPage.navigate();
        await signupPage.clickLoginButton();

        await expect(page).toHaveURL('/login');
        await expect(loginPage.getPageTitle()).toHaveText('Авторизація');
    });
});