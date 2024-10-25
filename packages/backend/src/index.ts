import express from 'express';
import cors from 'cors';
import { helloRouter } from './routes/hello.js';
import mongoose from "mongoose";
import { config } from 'dotenv';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

config({
    path: process.env.NODE_ENV === 'production'
        ? '.env'
        : '.env.local'
});

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
    console.log("MISSING MONGODB_URI");
    process.exit(1);
}

const mongoURL = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

app.use('/api', helloRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export { app };
