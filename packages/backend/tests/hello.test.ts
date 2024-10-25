import request from 'supertest';
import { app } from '../src/index.js';

describe('Hello API', () => {
    it('should return hello message', async () => {
        const response = await request(app).get('/api/hello');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Hello from the backend!' });
    });
});
