import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import mongoSanitizer from 'express-mongo-sanitize';
import cors from 'cors';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import connectDB from './db/connect';
import { authRouter, jobsRouter } from './routes';
import {
    errorHandler,
    notFoundHandler,
    authenticateRequest,
} from './middlewares';

dotenv.config();

const port = process.env.PORT ?? 8080;
const app = express();

app.set('trust proxy', 1);

app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }),
);
app.use(express.json());

app.use(helmet());
app.use(cors());
app.use(mongoSanitizer());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateRequest, jobsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
    try {
        await connectDB(process.env.MONGO_URI!);

        app.listen(port, () => {
            console.log(`Server Listening to port: ${port}...`);
        });
    } catch (error) {
        console.log('Failed to Connect to Database...');
        console.log('Shutting Application...');
    }
}

void startServer();
