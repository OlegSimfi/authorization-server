import { Locator, Page } from '@playwright/test';

export class HomePage {
    private page: Page;
    private greetingMessage: Locator;
    private logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.greetingMessage = page.locator('h1');
        this.logoutButton = page.locator('.submit-text');
    }

    async navigate() {
        await this.page.goto('/home');
    }

    async getGreetingMessage(): Promise<string> {
        const text = await this.greetingMessage.textContent();
        if (text === null) {
            throw new Error('Greeting message is not found or has no text content.');
        }
        return text;
    }

    async clickLogoutButton() {
        await this.logoutButton.click();
    }

    isGreetingMessageVisible(): Promise<boolean> {
        return this.greetingMessage.isVisible();
    }

    isLogoutButtonVisible(): Promise<boolean> {
        return this.logoutButton.isVisible();
    }
}