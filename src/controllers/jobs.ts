import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Job from '../models/Job';
import { NotFound } from '../errors';
import { IJob, IJobDocument } from '../types';

type GetAllJobsResponseBody = {
    jobs: IJobDocument[];
    count: number;
};
type GetAllJobsRequestHandler = RequestHandler<object, GetAllJobsResponseBody>;

const getAllJobs: GetAllJobsRequestHandler = async function (req, res) {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort(
        'createdAt',
    );
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

type GetJobParamsDictionary = { id: string };
type GetJobResponseBody = { job: IJobDocument };
type GetJobRequestHandler = RequestHandler<
    GetJobParamsDictionary,
    GetJobResponseBody
>;

const getJob: GetJobRequestHandler = async function (req, res) {
    const {
        params: { id: jobId },
        user: { userId },
    } = req;

    const job = await Job.findOne({
        createdBy: userId,
        _id: jobId,
    });

    if (!job) {
        throw new NotFound(`No Job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({ job });
};

type CreateJobRequestBody = IJob;
type CreateJobResponseBody = { job: IJobDocument };
type CreateJobRequestHandler = RequestHandler<
    object,
    CreateJobResponseBody,
    CreateJobRequestBody
>;

const createJob: CreateJobRequestHandler = async function (req, res) {
    req.body.createdBy = req.user.userId;

    const job = await Job.create(req.body);

    res.status(StatusCodes.CREATED).json({ job });
};

type UpdateJobRequestBody = Partial<Omit<IJob, 'createdBy'>>;
type UpdateJobParamsDictionary = { id: string };
type UpdateJobResponseBody = { job: IJobDocument };
type UpdateJobRequestHandler = RequestHandler<
    UpdateJobParamsDictionary,
    UpdateJobResponseBody,
    UpdateJobRequestBody
>;

const updateJob: UpdateJobRequestHandler = async function (req, res) {
    const {
        params: { id: jobId },
        user: { userId },
    } = req;

    const updatedJob = await Job.findOneAndUpdate(
        {
            _id: jobId,
            createdBy: userId,
        },
        req.body,
        { runValidators: true, new: true },
    );

    if (!updatedJob) {
        throw new NotFound(`No Job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({ job: updatedJob });
};

type DeleteJobParamsDictionary = { id: string };
type DeleteJobRequestHandler = RequestHandler<DeleteJobParamsDictionary>;

const deleteJob: DeleteJobRequestHandler = async function (req, res) {
    const {
        params: { id: jobId },
        user: { userId },
    } = req;

    const deletedJob = await Job.findOneAndDelete({
        _id: jobId,
        createdBy: userId,
    });

    if (!deletedJob) {
        throw new NotFound(`No Job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).send();
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
