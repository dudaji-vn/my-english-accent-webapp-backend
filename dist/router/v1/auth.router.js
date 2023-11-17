"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const auth_controller_1 = __importDefault(require("../../controllers/auth.controller"));
const catchAsync_1 = require("../../middleware/catchAsync");
const tsyringe_1 = require("tsyringe");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const authController = tsyringe_1.container.resolve(auth_controller_1.default);
const authRouter = express_1.default.Router();
authRouter.post('/register', (0, catchAsync_1.catchAsync)(authController.register.bind(authController)));
authRouter.post('/login', (0, catchAsync_1.catchAsync)(authController.login.bind(authController)));
authRouter.post('/adminRegister', (0, catchAsync_1.catchAsync)(authController.adminRegister.bind(authController)));
authRouter.post('/adminLogin', (0, catchAsync_1.catchAsync)(authController.adminLogin.bind(authController)));
authRouter.get('/profile', auth_1.default, (0, catchAsync_1.catchAsync)(authController.getProfile.bind(authController)));
exports.default = authRouter;
