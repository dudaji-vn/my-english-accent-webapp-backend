"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const auth_1 = __importDefault(require("../../middleware/auth"));
const catchAsync_1 = require("../../middleware/catchAsync");
const user_controller_1 = __importDefault(require("../../controllers/user.controller"));
const userController = tsyringe_1.container.resolve(user_controller_1.default);
const userRouter = express_1.default.Router();
userRouter.get('/allUsers', auth_1.default, (0, catchAsync_1.catchAsync)(userController.getAllUser.bind(userController)));
userRouter.get('/lectures', auth_1.default, (0, catchAsync_1.catchAsync)(userController.getMyPractice.bind(userController)));
userRouter.put('/addOrUpdateEnrollment', auth_1.default, (0, catchAsync_1.catchAsync)(userController.addOrUpdateEnrollment.bind(userController)));
exports.default = userRouter;
