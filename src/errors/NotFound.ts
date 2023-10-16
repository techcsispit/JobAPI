import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customAPIError';

class NotFound extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.NOT_FOUND);
    }
}

export default NotFound;
