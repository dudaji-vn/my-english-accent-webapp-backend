"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const vocabulary_controller_1 = __importDefault(require("../../controllers/vocabulary.controller"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const catchAsync_1 = require("../../middleware/catchAsync");
const vocabularyController = tsyringe_1.container.resolve(vocabulary_controller_1.default);
const vocabularyRouter = express_1.default.Router();
vocabularyRouter.get('/getVocabularyById/:vocabularyId', auth_1.default, (0, catchAsync_1.catchAsync)(vocabularyController.getVocabularyById.bind(vocabularyController)));
vocabularyRouter.get('/getAllVocabulariesByLecture', auth_1.default, (0, catchAsync_1.catchAsync)(vocabularyController.getAllVocabulariesByLectures.bind(vocabularyController)));
vocabularyRouter.get('/getAllVocabulariesByLectureId', (0, catchAsync_1.catchAsync)(vocabularyController.getAllVocabularyByLectureId.bind(vocabularyController)));
vocabularyRouter.put('/addOrUpdateVocabulary', (0, catchAsync_1.catchAsync)(vocabularyController.addOrUpdateVocabulary.bind(vocabularyController)));
exports.default = vocabularyRouter;
