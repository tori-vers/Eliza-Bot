const request = require('supertest');
const app = require('../server'); // Import the Express app for testing

// Test suite for the '/eliza' endpoint
describe('GET /eliza', () => {
    // Test case for checking the response from the '/eliza' endpoint
    it('responds with JSON', async () => {
        const response = await request(app).get('/eliza?input=Hello');
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('application/json');
    });

    // Test case for handling missing input
    it('handles missing input', async () => {
        const response = await request(app).get('/eliza');
        expect(response.statusCode).toBe(400);
    });

    // Add more server-sided tests here
});