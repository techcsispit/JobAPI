import { ErrorRequestHandler } from 'express';
import { Error } from 'mongoose';
import { CustomAPIError } from '../errors';
import { StatusCodes } from 'http-status-codes';

type ErrorType = object & { message?: string; code?: number };

const errorHandler: ErrorRequestHandler = function (
    err: ErrorType,
    req,
    res,
    _next,
) {
    if (err instanceof CustomAPIError) {
        res.status(err.statusCode).json({ msg: err.message });
        return;
    }

    let customError: CustomAPIError;

    if (err instanceof Error.ValidationError) {
        // * For Mongoose Validation
        customError = new CustomAPIError(err.message, StatusCodes.BAD_REQUEST);
    } else if (err instanceof Error.CastError) {
        customError = new CustomAPIError(err.message, StatusCodes.BAD_REQUEST);
    } else if (err.code && err.code === 11000) {
        //  * For MongoDB Error
        customError = new CustomAPIError(
            'This Email already Exists',
            StatusCodes.BAD_REQUEST,
        );
    } else {
        customError = new CustomAPIError(
            err.message ?? 'Something Went Wrong',
            StatusCodes.INTERNAL_SERVER_ERROR,
        );
    }

    console.log(err.message);

    res.status(customError.statusCode).json({
        msg: customError.message,
    });
};

export default errorHandler;
