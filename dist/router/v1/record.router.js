"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const record_controller_1 = __importDefault(require("../../controllers/record.controller"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const catchAsync_1 = require("../../middleware/catchAsync");
const recordController = tsyringe_1.container.resolve(record_controller_1.default);
const recordRouter = express_1.default.Router();
recordRouter.put('/addOrUpdateRecord', auth_1.default, (0, catchAsync_1.catchAsync)(recordController.addOrUpdateRecord.bind(recordController)));
recordRouter.get('/getMyRecordsByLecture', auth_1.default, (0, catchAsync_1.catchAsync)(recordController.getMyRecordsByLecture.bind(recordController)));
exports.default = recordRouter;
