"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const error_1 = require("./error");
const catchAsync = (fn) => {
    return (req, res, next) => {
        try {
            fn(req, res, next).catch((err) => {
                console.log({
                    messsage: err.message,
                    stack: err.stack
                });
                if (err instanceof error_1.UnAuthorizeError) {
                    return res.error(401, err.message, err.stack);
                }
                if (err instanceof error_1.BadRequestError) {
                    return res.error(400, err.message, err.stack);
                }
                return res.error(500, err.message, err.stack);
            });
        }
        catch (err) {
            if (err instanceof Error) {
                return res.error(500, err.message, err.stack);
            }
            return res.error(500, 'Uncaught error');
        }
    };
};
exports.catchAsync = catchAsync;
