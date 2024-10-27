import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    role: string;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];

    // Check if Authorization header is present and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(403).send('Token required');
        return;
    }

    // Extract the token part by removing "Bearer "
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            res.status(403).send('Invalid token');
            return;
        }

        req.user = decoded as JwtPayload;
        next();
    });
}

export function optionalAuthenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];

    // Check if Authorization header is present and starts with "Bearer "
    if (authHeader && authHeader.startsWith("Bearer ")) {
        // Extract the token part by removing "Bearer "
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                res.status(403).send('Invalid token');
                return;
            }

            req.user = decoded as JwtPayload;
            next();
        });
    } else {
        next();
    }
}



export default authenticateToken;
