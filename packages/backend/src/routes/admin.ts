import {Router, Request, Response} from 'express';
import authenticateToken from '../authenticateToken';

export const adminRouter = Router();

adminRouter.get('/archive', authenticateToken, (req: Request, res: Response): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).send('Admin access required');
        return;
    }
    // Archive logic here
    res.send('Object archived');
});

adminRouter.get('/search', authenticateToken, (req: Request, res: Response): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).send('Admin access required');
        return
    }
    // Search logic here
    res.send('Search triggered');
});
