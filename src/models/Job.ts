import { Schema, model } from 'mongoose';
import { IJob } from '../types';

const JobSchema = new Schema<IJob>(
    {
        company: {
            type: String,
            required: [true, 'Please Provide a Company'],
            maxlength: 50,
        },
        role: {
            type: String,
            required: [true, 'Please Provide Job Role'],
            maxlength: 50,
        },
        status: {
            type: String,
            enum: ['interview', 'declined', 'pending'],
            default: 'pending',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please Provide a User'],
        },
    },
    {
        timestamps: true,
    },
);

export default model<IJob>('Job', JobSchema);
