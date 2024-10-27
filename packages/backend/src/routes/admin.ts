import {Router, Request, Response} from 'express';
import authenticateToken from '../authenticateToken';
import ResultModel from "../models/Result";

export const adminRouter = Router();

adminRouter.post('/archive', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    if (req.user?.role !== 'admin') {
        res.status(403).send('Admin access required');
        return;
    }

    const { objectId, unarchive } = req.query;

    if (!objectId) {
        res.status(400).send('Object ID is required');
        return
    }

    try {
        const update = { archived: unarchive !== 'true' }; // Set archived based on unarchive query
        const result = await ResultModel.findByIdAndUpdate(objectId, update, { new: true });

        if (!result) {
            res.status(404).send('Object not found');
            return
        }

        res.send(`Object ${unarchive === 'true' ? 'unarchived' : 'archived'}`);
    } catch (error) {
        console.error('Error archiving/unarchiving object:', error);
        res.status(500).send('Internal server error');
    }
});

adminRouter.get('/search', authenticateToken, (req: Request, res: Response): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).send('Admin access required');
        return
    }
    // Search logic here
    res.send('Search triggered');
});
