"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const script_controller_1 = __importDefault(require("../../controllers/script.controller"));
const catchAsync_1 = require("../../middleware/catchAsync");
const scriptController = tsyringe_1.container.resolve(script_controller_1.default);
const scriptRouter = express_1.default.Router();
scriptRouter.get('/importData', (0, catchAsync_1.catchAsync)(scriptController.importDataFromExcel.bind(scriptController)));
exports.default = scriptRouter;
