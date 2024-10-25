import { Router } from 'express';

export const helloRouter = Router();

helloRouter.get('/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
