"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const club_controller_1 = __importDefault(require("../../controllers/club.controller"));
const catchAsync_1 = require("../../middleware/catchAsync");
const auth_1 = __importDefault(require("../../middleware/auth"));
const clubController = tsyringe_1.container.resolve(club_controller_1.default);
const clubRouter = express_1.default.Router();
clubRouter.put('/addOrUpdateClub', auth_1.default, (0, catchAsync_1.catchAsync)(clubController.addOrUpdateClub.bind(clubController)));
clubRouter.get('/getClubsOwner', auth_1.default, (0, catchAsync_1.catchAsync)(clubController.getClubsOwner.bind(clubController)));
clubRouter.get('/getMembersInfo/:clubId', auth_1.default, (0, catchAsync_1.catchAsync)(clubController.getMembersInfo.bind(clubController)));
clubRouter.get('/getDetailClub/:clubId', auth_1.default, (0, catchAsync_1.catchAsync)(clubController.getDetailClub.bind(clubController)));
exports.default = clubRouter;
