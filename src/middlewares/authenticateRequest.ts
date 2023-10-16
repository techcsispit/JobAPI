import { NextFunction, Request, Response } from 'express';
import { RequestUserHeader } from '../types';
import JWT from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Unauthorized } from '../errors';
import dotenv from 'dotenv';
dotenv.config();

type LoginJWTPayload = JWT.JwtPayload & RequestUserHeader;

function authenticateRequest(req: Request, res: Response, next: NextFunction) {
    const authString = req.headers.authorization;

    if (!authString || !authString.startsWith('Bearer ')) {
        throw new Unauthorized('Invalid Credentials Provided');
    }

    const token = authString.split(' ')[1];

    try {
        const payload = JWT.verify(
            token,
            process.env.JWT_SECRET!,
        ) as LoginJWTPayload;

        req.user = {
            username: payload.username,
            userId: new Types.ObjectId(payload.userId),
        };

        next();
    } catch {
        throw new Unauthorized('Not Authorized');
    }
}

export default authenticateRequest;
