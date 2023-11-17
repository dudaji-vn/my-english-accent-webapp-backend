"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tsyringe_1 = require("tsyringe");
const common_1 = require("../const/common");
const vocabulary_mapping_1 = require("../coverter/vocabulary.mapping");
const Enrollment_1 = __importDefault(require("../entities/Enrollment"));
const Vocabulary_1 = __importDefault(require("../entities/Vocabulary"));
const error_1 = require("../middleware/error");
let VocabularyService = class VocabularyService {
    async getVocabularyById(vocabularyId, nativeLanguage) {
        const vocabulary = await Vocabulary_1.default.findById(vocabularyId).lean();
        return (0, vocabulary_mapping_1.convertToVocabularyWithTranslateDTO)(vocabulary, nativeLanguage);
    }
    async getAllVocabulariesByLectures(payload) {
        const { lectureId, userId, nativeLanguage } = payload;
        const aggQuery = [
            {
                $match: {
                    lecture: new mongoose_1.default.Types.ObjectId(lectureId)
                }
            },
            {
                $lookup: {
                    from: 'records',
                    localField: '_id',
                    foreignField: 'vocabulary',
                    as: 'records'
                }
            },
            {
                $addFields: {
                    record: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: '$records',
                                    as: 'record',
                                    cond: {
                                        $and: [
                                            {
                                                $eq: [
                                                    '$$record.user',
                                                    new mongoose_1.default.Types.ObjectId(payload.userId)
                                                ]
                                            },
                                            {
                                                $eq: ['$$record.challenge', null]
                                            }
                                        ]
                                    }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $project: {
                    'vocabulary._id': '$_id',
                    'vocabulary.created': '$created',
                    'vocabulary.updated': '$updated',
                    'vocabulary.title_display_language': '$title_display_language',
                    'vocabulary.text_translate': '$text_translate',
                    'vocabulary.phonetic_display_language': '$phonetic_display_language',
                    'vocabulary.lecture': '$lecture',
                    'vocabulary.voice_src': '$record.voice_src',
                    'vocabulary.record_id': '$record._id'
                }
            },
            {
                $sort: {
                    'vocabulary.voice_src': -1
                }
            }
        ];
        const currentEnrollMent = await Enrollment_1.default.findOne({
            user: userId,
            lecture: lectureId
        });
        const vocabularies = await Vocabulary_1.default.aggregate(aggQuery);
        return {
            currentStep: currentEnrollMent?.current_step ?? 0,
            enrollmentId: currentEnrollMent?._id ?? null,
            lectureId: lectureId,
            stage: currentEnrollMent?.stage ?? common_1.StageExercise.Open,
            vocabularies: vocabularies.map((item) => (0, vocabulary_mapping_1.convertToVocabularyWithRecordedDTO)(item, nativeLanguage))
        };
    }
    async getVocabularyByLectureId(lectureId) {
        let listVoca = [];
        if (!lectureId) {
            listVoca = await Vocabulary_1.default.find()
                .lean()
                .sort({
                lecture: 1,
                number_order: 1
            })
                .populate('lecture');
        }
        else {
            listVoca = await Vocabulary_1.default.find({
                lecture: lectureId
            })
                .lean()
                .sort({
                lecture: 1,
                number_order: 1
            })
                .populate('lecture');
        }
        const data = listVoca.map((voca) => {
            return (0, vocabulary_mapping_1.convertToDetailVocabularyByLecture)(voca);
        });
        return data;
    }
    async addOrUpdateVocabulary(payload) {
        const { lectureId, phonetic, titleDisplay, textKR, textVN, vocabularyId, numberOrder } = payload;
        if (!lectureId ||
            !phonetic ||
            !titleDisplay ||
            !textKR ||
            !textVN ||
            parseInt(numberOrder) < 0) {
            throw new error_1.BadRequestError('missing fields');
        }
        const textTranslate = {
            vn: textVN,
            kr: textKR
        };
        if (vocabularyId) {
            await Vocabulary_1.default.findByIdAndUpdate(payload.vocabularyId, {
                number_order: numberOrder,
                title_display_language: titleDisplay,
                lecture: lectureId,
                phonetic_display_language: phonetic,
                text_translate: textTranslate
            });
        }
        else {
            const existName = await Vocabulary_1.default.exists({
                title_display_language: titleDisplay
            });
            if (existName) {
                throw new error_1.BadRequestError('vocabulary is exist');
            }
            await Vocabulary_1.default.create({
                number_order: numberOrder,
                title_display_language: titleDisplay,
                lecture: lectureId,
                phonetic_display_language: phonetic,
                text_translate: textTranslate
            });
        }
        return true;
    }
};
VocabularyService = __decorate([
    (0, tsyringe_1.injectable)()
], VocabularyService);
exports.default = VocabularyService;
