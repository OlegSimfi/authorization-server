import {Locator, Page } from '@playwright/test';

export class LoginPage {
    private page: Page;
    private errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.errorMessage = page.locator('.login-message');
    }

    async navigate() {
        await this.page.goto('/login');
    }

    async enterLogin(login: string) {
        await this.page.fill('[id="field-login"]', login);
    }

    async enterPassword(password: string) {
        await this.page.fill('[id="field-pasw"]', password);
    }

    async clickLoginButton() {
        await this.page.click('button[class="submit"]');
    }

    getErrorMessage(): Locator {
        return this.errorMessage;
    }
}