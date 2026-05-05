const request = require('supertest');
const express = require('express');

// Mock simple app for testing endpoints without DB dependency for now
const app = express();
app.get('/api/test', (req, res) => res.status(200).json({ message: 'API is working' }));

describe('API Health Check', () => {
    it('should return 200 OK and working message', async () => {
        const res = await request(app).get('/api/test');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'API is working');
    });
});
