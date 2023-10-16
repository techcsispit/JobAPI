import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFoundHandler: RequestHandler = function (req, res) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: 'Resource Not Found' });
};

export default notFoundHandler;
