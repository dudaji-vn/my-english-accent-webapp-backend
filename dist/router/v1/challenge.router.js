"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const challenge_controller_1 = __importDefault(require("../../controllers/challenge.controller"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const catchAsync_1 = require("../../middleware/catchAsync");
const challengeController = tsyringe_1.container.resolve(challenge_controller_1.default);
const challengeRouter = express_1.default.Router();
challengeRouter.get('/getChallengesInClub/:clubId', auth_1.default, (0, catchAsync_1.catchAsync)(challengeController.getChallengesInClub.bind(challengeController)));
challengeRouter.get('/getChallengeDetailInClub/:challengeId', auth_1.default, (0, catchAsync_1.catchAsync)(challengeController.getChallengeDetailInClub.bind(challengeController)));
challengeRouter.patch('/updateChallengeMember/:challengeId', auth_1.default, (0, catchAsync_1.catchAsync)(challengeController.updateChallengeMember.bind(challengeController)));
challengeRouter.get('/getRecordToListenByChallenge/:challengeId', auth_1.default, (0, catchAsync_1.catchAsync)(challengeController.getRecordToListenByChallenge.bind(challengeController)));
challengeRouter.get('/getAllRecordByChallenge/:challengeId', auth_1.default, (0, catchAsync_1.catchAsync)(challengeController.getAllRecordInChallenge.bind(challengeController)));
exports.default = challengeRouter;
