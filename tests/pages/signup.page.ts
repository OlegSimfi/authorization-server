import { Locator, Page } from '@playwright/test';

export class SignupPage {
    private page: Page;
    private pageTitle: Locator;
    private errorMessage: Locator;
    private loginField: Locator;
    private passwordField: Locator;
    private confirmPasswordField: Locator;
    private createUserButton: Locator;
    private loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('h1');
        this.errorMessage = page.locator('.login-message');
        this.loginField = page.locator('[id="field-login"]');
        this.passwordField = page.locator('[id="field-password"]');
        this.confirmPasswordField = page.locator('[id="field-password2"]');
        this.createUserButton = page.locator('.submit-text');
        this.loginButton = page.locator('.password_refresh');
    }

    async navigate() {
        await this.page.goto('/signup');
    }

    async enterLogin(login: string) {
        await this.loginField.fill(login);
    }

    async enterPassword(password: string) {
        await this.passwordField.fill(password);
    }

    async enterConfirmPassword(password: string) {
        await this.confirmPasswordField.fill(password);
    }

    async clickCreateUserButton() {
        await this.createUserButton.click();
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    getErrorMessage(): Locator {
        return this.errorMessage;
    }
}