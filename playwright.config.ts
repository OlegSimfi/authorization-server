import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    reporter: 'html',
    use: {
        baseURL: 'http://127.0.0.1:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'Chromium',
            use: {
                browserName: 'chromium',
            },
        },
    ],
});