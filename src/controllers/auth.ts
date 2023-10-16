import { RequestHandler } from 'express';
import { IUser } from '../types';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User';
import { BadRequest, Unauthorized } from '../errors';

interface RegisterResponseBody {
    user: {
        username: string;
    };
    token: string;
}
type RegisterRequestBody = IUser;
type RegisterRequestHandler = RequestHandler<
    object,
    RegisterResponseBody,
    RegisterRequestBody
>;

const registerUser: RegisterRequestHandler = async function (req, res) {
    const user = await User.create({ ...req.body });
    const token = user.createToken();
    res.status(StatusCodes.CREATED).json({
        user: { username: user.name },
        token,
    });
};

type LoginResponseBody = RegisterResponseBody;
interface LoginRequestBody {
    email: string;
    password: string;
}
type LoginRequestHandler = RequestHandler<
    object,
    LoginResponseBody,
    LoginRequestBody
>;

const loginUser: LoginRequestHandler = async function (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequest('Please Provide Email & Password');
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new Unauthorized('Invalid Credentials Provided');
    }

    const matchedPassword = await user.comparePassword(password);

    if (!matchedPassword) {
        throw new Unauthorized('Invalid Credentials Provided');
    }

    const token = user.createToken();

    res.status(StatusCodes.OK).json({
        user: {
            username: user.name,
        },
        token,
    });
};

export { registerUser, loginUser };
