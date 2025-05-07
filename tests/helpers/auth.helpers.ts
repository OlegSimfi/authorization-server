import {APIRequestContext, Page} from "@playwright/test";

export async function loginAndSetCookies(
    request: APIRequestContext,
    page: Page,
    baseURL: string | undefined,
    userCredentials: { login: string; password: string }
) {
    // Log in the user
    const loginResponse = await request.post(`${baseURL}/login`, {
        data: {
            login: userCredentials.login,
            password: userCredentials.password,
        },
    });
    if (loginResponse.status() !== 200) {
        throw new Error(`Login failed with status: ${loginResponse.status()}`);
    }

    // Parse cookies
    const cookies = loginResponse.headers()['set-cookie'];
    const parsedCookies = cookies
        .split('; ')
        .map((cookie: string) => {
            const [name, value] = cookie.split('=');
            if (!baseURL) {
                throw new Error('baseURL is undefined');
            }
            return value
                ? {
                    name,
                    value,
                    domain: new URL(baseURL).hostname,
                    path: '/',
                }
                : null; // Filter out invalid cookies
        })
        .filter((cookie: { name: string; value: string; domain: string; path: string } | null): cookie is { name: string; value: string; domain: string; path: string } =>
            cookie !== null && typeof cookie === 'object'
        );

    // Add cookies to the browser context
    await page.context().addCookies(parsedCookies);
}