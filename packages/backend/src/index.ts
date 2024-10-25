import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { helloRouter, searchRouter } from './routes';
import mongoose from "mongoose";


config({
    path: process.env.NODE_ENV === 'development'
        ? '.env.local'
        : '.env'
});


const port = process.env.PORT || 3001;


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

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', helloRouter, searchRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export { app };
