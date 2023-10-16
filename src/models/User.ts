import { Schema, model, Model } from 'mongoose';
import { IUser, RequestUserHeader } from '../types';
import JWT from 'jsonwebtoken';
import argon2 from 'argon2';
import dotenv from 'dotenv';
dotenv.config();

interface IUserMethods {
    createToken(): string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

type IUserModel = Model<IUser, object, IUserMethods>;

// eslint-disable-next-line
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const UserSchema = new Schema<IUser, IUserModel, IUserMethods>({
    name: {
        type: String,
        required: [true, 'Please Provide a Name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please Provide an Email'],
        match: [emailRegex, 'Please Provide a Valid Email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please Provide a Password'],
    },
});

UserSchema.pre('save', async function () {
    this.password = await argon2.hash(this.password);
});

UserSchema.method('createToken', function () {
    const jwtPayload: RequestUserHeader = {
        userId: this._id,
        username: this.name,
    };
    return JWT.sign(jwtPayload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_LIFETIME!,
    });
});

UserSchema.method('comparePassword', function (candidatePassword: string) {
    return argon2.verify(this.password, candidatePassword);
});

export default model<IUser, IUserModel>('User', UserSchema);
