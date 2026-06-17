import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';



test.describe('Posts API', { tag: ['@posts', '@api'] }, () => {
   
    test('GET /posts', { tag: '@get' }, async ({ request }) => {
        const response = await request.get(`${BASE_URL}/posts`);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect( Array.isArray(responseBody) ).toBe(true);
        expect(responseBody.length).toBe(100);
        
        for(let obj of responseBody){
            expect(obj.id).toBeDefined();
            expect(typeof obj.id).toBe('number');
            expect(obj.userId).toBeDefined();
            expect(obj.title).toBeDefined();
            expect(obj.body).toBeDefined();
        }
    });


    test(`GET /posts/1`, { tag: '@get' }, async ({ request }) => {
        const response = await request.get(`${BASE_URL}/posts/1`);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.id).toBeDefined();
        expect(responseBody.userId).toBeDefined();
        expect(responseBody.title).toBeDefined(); 
        expect(responseBody.body).toBeDefined();
        
        expect(typeof responseBody.id).toBe('number');
        expect(typeof responseBody.userId).toBe('number');
        expect(typeof responseBody.title).toBe('string');
        expect(typeof responseBody.body).toBe('string');

        expect(responseBody.id).toBeGreaterThan(0);
        expect(responseBody.userId).toBeGreaterThan(0);
        expect(responseBody.title.length).toBeGreaterThan(0);
        expect(responseBody.body.length).toBeGreaterThan(0);
    });

    
    test(`GET /posts/1/comments`, { tag: '@get' }, async ({ request }) => {
        const response = await request.get(`${BASE_URL}/posts/1/comments`);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect( Array.isArray(responseBody) ).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
        
        for(let comment of responseBody){
            expect(comment.postId).toBeDefined();
            expect(comment.postId).toBe(1);
            expect(comment.id).toBeDefined();
            expect(comment.name).toBeDefined();
            expect(comment.email).toBeDefined();
            expect(comment.body).toBeDefined();
        }
    });


    test(`GET /comments?postId=1`, { tag: '@get' }, async ({ request}) => {
        const response = await request.get(`${BASE_URL}/comments?postId=1`);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);

        for (const comment of responseBody) {
            expect(comment.postId).toBe(1);
            expect(comment.id).toBeDefined();
            expect(comment.name).toBeDefined();
            expect(comment.email).toBeDefined();
            expect(comment.body).toBeDefined();
        }
    });



    test('POST /posts', { tag: '@post' }, async ({ request }) => {
        const newPost = {
            userId: 1,
            title: 'hello',
            body: 'barev',
        };

        const response = await request.post(`${BASE_URL}/posts`, {
            data: newPost,
        });

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.id).toBeDefined();
        expect(typeof responseBody.id).toBe('number');
        expect(responseBody.userId).toBe(newPost.userId);
        expect(responseBody.title).toBe(newPost.title);
        expect(responseBody.body).toBe(newPost.body);
    });


    test('PUT /posts/1', { tag: '@put' }, async ({ request }) => {
        const updatedPost = {
            id: 1,
            userId: 1,
            title: 'updated title',
            body: 'updated body',
        };

        const response = await request.put(`${BASE_URL}/posts/1`, {
            data: updatedPost,
        });

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id).toBe(updatedPost.id);
        expect(responseBody.userId).toBe(updatedPost.userId);
        expect(responseBody.title).toBe(updatedPost.title);
        expect(responseBody.body).toBe(updatedPost.body);
    });


    test('PATCH /posts/1', { tag: '@patch' }, async ({ request }) => {
        const patchData = {
            title: 'patched title',
        };

        const originalResponse = await request.get(`${BASE_URL}/posts/1`);
        const originalPost = await originalResponse.json();

        const response = await request.patch(`${BASE_URL}/posts/1`, {
            data: patchData,
        });

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id).toBe(1);
        expect(responseBody.title).toBe(patchData.title);
        expect(responseBody.userId).toBe(originalPost.userId);
        expect(responseBody.body).toBe(originalPost.body);
    });


    test('DELETE /posts/1', { tag: '@delete' }, async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/posts/1`);

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toEqual({});
    });


});