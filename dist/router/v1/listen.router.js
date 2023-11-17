"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const listen_controller_1 = __importDefault(require("../../controllers/listen.controller"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const catchAsync_1 = require("../../middleware/catchAsync");
const listenController = tsyringe_1.container.resolve(listen_controller_1.default);
const listenRouter = express_1.default.Router();
listenRouter.put('/createOrUpdatePlaylist', auth_1.default, (0, catchAsync_1.catchAsync)(listenController.createOrUpdatePlaylist.bind(listenController)));
listenRouter.get('/getPlaylistSummary', auth_1.default, (0, catchAsync_1.catchAsync)(listenController.getPlaylistSummary.bind(listenController)));
listenRouter.get('/getPlaylistListenByLecture', auth_1.default, (0, catchAsync_1.catchAsync)(listenController.getPlaylistListenByLecture.bind(listenController)));
listenRouter.get('/getLecturesAvailable', auth_1.default, (0, catchAsync_1.catchAsync)(listenController.getLecturesAvailable.bind(listenController)));
listenRouter.get('/getUsersAvailable', auth_1.default, (0, catchAsync_1.catchAsync)(listenController.getUsersAvailable.bind(listenController)));
exports.default = listenRouter;
