"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../entities/User"));
const auth = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(400).json({ msg: 'Invalid Authentication.' });
        }
        token = token.split(' ')[1];
        const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!tokenSecret) {
            throw Error('token secret is required');
        }
        const decoded = jsonwebtoken_1.default.verify(token, tokenSecret);
        if (!decoded) {
            return res
                .status(400)
                .json({ message: 'Invalid Authentication.' });
        }
        const user = await User_1.default.findOne({ _id: decoded.userId });
        if (!user) {
            throw new Error('user not found in system');
        }
        req.user = user;
        req.user.userId = user._id;
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            return res.error(401, err.message, err.stack);
        }
        return res.error(401, 'Uncaught Error in auth middleware', '');
    }
};
exports.default = auth;
