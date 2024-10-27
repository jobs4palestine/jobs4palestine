import { Router } from 'express';
import jwt from 'jsonwebtoken';

export const loginRouter = Router();



loginRouter.post('/login', (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.status(401).json({ message: 'Authorization header missing or incorrect' });
        return;
    }

    const base64Credentials = authHeader.split(' ')[1];
    const password = Buffer.from(base64Credentials, 'base64').toString('ascii');

    let role;
    if (password === process.env.JOBS_NORMAL_USER_PASSWORD) role = 'user';
    else if (password === process.env.JOBS_ADMIN_PASSWORD) role = 'admin';
    else {
        res.status(401).json({ message: 'Incorrect password' });
        return;
    }

    const token = jwt.sign({ role }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    res.json({ token, userType: role });
});

