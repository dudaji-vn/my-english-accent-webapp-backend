"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const lecture_controller_1 = __importDefault(require("../../controllers/lecture.controller"));
const catchAsync_1 = require("../../middleware/catchAsync");
const lectureController = tsyringe_1.container.resolve(lecture_controller_1.default);
const lectureRouter = express_1.default.Router();
lectureRouter.get('/all', (0, catchAsync_1.catchAsync)(lectureController.getAllLectures.bind(lectureController)));
lectureRouter.get('/allForAdmin', (0, catchAsync_1.catchAsync)(lectureController.getAllLecturesForAdmin.bind(lectureController)));
lectureRouter.put('/addOrUpdateLecture', (0, catchAsync_1.catchAsync)(lectureController.addOrUpdateLecture.bind(lectureController)));
exports.default = lectureRouter;
