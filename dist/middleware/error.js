"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.UnAuthorizeError = void 0;
class UnAuthorizeError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnAuthorizeError';
        Object.setPrototypeOf(this, UnAuthorizeError.prototype);
    }
}
exports.UnAuthorizeError = UnAuthorizeError;
class BadRequestError extends Error {
    constructor(message = 'BadRequest') {
        super(message);
        this.name = 'BadRequestError';
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
exports.BadRequestError = BadRequestError;
