// types.d.ts
import { Request } from 'express';

export interface User {
    role: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}
