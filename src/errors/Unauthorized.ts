import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customAPIError';

class Unauthorized extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

export default Unauthorized;
