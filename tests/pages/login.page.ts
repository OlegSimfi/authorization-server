import {Locator, Page } from '@playwright/test';

export class LoginPage {
    private page: Page;
    private pageTitle: Locator;
    private errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('h1');
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

    getPageTitle(): Locator {
        return this.pageTitle;
    }

    getErrorMessage(): Locator {
        return this.errorMessage;
    }
}