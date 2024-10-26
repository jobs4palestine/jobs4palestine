import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    role: string;
}

function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(403).send('Token required');
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            res.status(403).send('Invalid token');
            return;
        }

        req.user = decoded as JwtPayload;
        next();
    });
}

export default authenticateToken;
