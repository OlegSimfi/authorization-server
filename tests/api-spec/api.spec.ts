import { test, expect } from '@playwright/test';

const uniqueLogin = `test_user_${Date.now()}`; // Generate a unique login using a timestamp

let testUser = {
    login: 'test_user',
    password: 'password123',
};

test.describe('API Tests', () => {
    test('POST /signup - should create a new user', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/signup`, {
            data: {
                login: uniqueLogin,
                password: testUser.password,
                password2: testUser.password,
            },
        });

        expect(response.status()).toBe(200);
        // Verify the response body contains the expected redirect
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('redirect', '/login');
    });

    test('POST /login - should log in the user', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/login`, {
            data: {
                login: testUser.login,
                password: testUser.password,
            },
        });
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('redirect', '/home');

    });

    test('GET /get-user-info - should return user info for authorized user', async ({ request, baseURL }) => {
        const loginResponse = await request.post(`${baseURL}/login`, {
            data: {
                login: testUser.login,
                password: testUser.password,
            },
        });
        const cookies = loginResponse.headers()['set-cookie'];

        const response = await request.get(`${baseURL}/get-user-info`, {
            headers: {
                Cookie: cookies,
            },
        });

        expect(response.status()).toBe(200);
        expect(await response.json()).toHaveProperty('username', 'test_user');
    });

    test('POST /logout - should log out the user', async ({ request, baseURL }) => {
        const loginResponse = await request.post(`${baseURL}/login`, {
            data: {
                login: testUser.login,
                password: testUser.password,
            },
        });
        const cookies = loginResponse.headers()['set-cookie'];

        const logoutResponse = await request.post(`${baseURL}/logout`, {
            headers: {
                Cookie: cookies,
            },
        });
        expect(logoutResponse.status()).toBe(200);

        // Attempt to access a protected endpoint after logout
        const protectedResponse = await request.get(`${baseURL}/get-user-info`, {
            headers: {
                Cookie: cookies,
            },
        });
        expect(protectedResponse.status()).toBe(401); // Expecting that 401 Unauthorized is returned for logged-out users
    });
});

test.describe('Negative API Tests', () => {
    test('POST /signup - should fail with mismatched passwords', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/signup`, {
            data: {
                login: uniqueLogin,
                password: testUser.password,
                password2: 'differentPassword',
            },
        });
        const responseBody = await response.json();

        expect(response.status()).toBe(400);
        expect(responseBody).toHaveProperty('errorCode', 'BAD_REQUEST');
    });

    test('POST /login - should fail with incorrect credentials', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/login`, {
            data: {
                login: 'nonexistent_user',
                password: 'wrongPassword',
            },
        });
        const responseBody = await response.json();

        expect(response.status()).toBe(401);
        expect(responseBody).toHaveProperty('errorCode', 'UNAUTHORIZED');
    });

    test('GET /get-user-info - should fail without authorization', async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/get-user-info`);
        const responseBody = await response.json();

        expect(response.status()).toBe(401);
        expect(responseBody).toHaveProperty('errorCode', 'UNAUTHORIZED');
    });

    test('POST /logout - should fail without authorization', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/logout`);
        const responseBody = await response.json();

        expect(response.status()).toBe(401);
        expect(responseBody).toHaveProperty('errorCode', 'UNAUTHORIZED');
    });
});