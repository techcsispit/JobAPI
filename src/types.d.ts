import { Request as _req } from 'express';
import { HydratedDocument, Types } from 'mongoose';

interface IUser {
    name: string;
    email: string;
    password: string;
}

type JobStatus = 'interview' | 'declined' | 'pending';

interface IJob {
    company: string;
    role: string;
    status?: JobStatus;
    createdBy: Types.ObjectId;
}

type IJobDocument = HydratedDocument<IJob>;

interface RequestUserHeader {
    username: string;
    userId: Types.ObjectId;
}

declare module '@types/express-serve-static-core' {
    interface Request {
        user: RequestUserHeader;
    }
}
