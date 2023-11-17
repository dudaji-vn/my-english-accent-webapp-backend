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
const tsyringe_1 = require("tsyringe");
const error_1 = require("../middleware/error");
const Record_1 = __importDefault(require("../entities/Record"));
const mongoose_1 = __importDefault(require("mongoose"));
const Lecture_1 = __importDefault(require("../entities/Lecture"));
const record_mapping_1 = require("../coverter/record.mapping");
let RecordService = class RecordService {
    async getMyRecordsByLecture(payload) {
        const { lectureId, userId } = payload;
        const aggregateQuery = [
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(lectureId)
                }
            },
            {
                $lookup: {
                    from: 'vocabularies',
                    localField: '_id',
                    foreignField: 'lecture',
                    as: 'vocabularies'
                }
            },
            {
                $unwind: '$vocabularies'
            },
            {
                $lookup: {
                    from: 'records',
                    let: { voca: '$vocabularies._id' },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$vocabulary', '$$voca'] },
                                                { $eq: ['$user', new mongoose_1.default.Types.ObjectId(userId)] }
                                            ]
                                        }
                                    },
                                    {
                                        challenge: { $eq: null }
                                    }
                                ]
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: 'vocabularies.record'
                }
            },
            // {
            //   $match: {
            //     'vocabularies.record': { $ne: [] }
            //   }
            // },
            {
                $addFields: {
                    'vocabularies.record': { $arrayElemAt: ['$vocabularies.record', 0] }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    lecture_name: { $first: '$lecture_name' },
                    img_src: { $first: '$img_src' },
                    created: { $first: '$created' },
                    updated: { $first: '$updated' },
                    vocabularies: { $push: '$vocabularies' }
                }
            }
        ];
        const data = await Lecture_1.default.aggregate(aggregateQuery);
        return data.map((item) => (0, record_mapping_1.convertToRecordsByLectureDTO)(item))[0];
    }
    async addOrUpdateRecord(payload) {
        const { challengeId, userId, vocabularyId, voiceSrc } = payload;
        if (!vocabularyId || !voiceSrc) {
            throw new error_1.BadRequestError('Fields required: vocabularyId, voiceSrc');
        }
        if (!challengeId) {
            await Record_1.default.findOneAndUpdate({
                user: userId,
                vocabulary: vocabularyId,
                challenge: null
            }, { voice_src: voiceSrc }, { upsert: true });
        }
        else {
            await Record_1.default.findOneAndUpdate({ user: userId, vocabulary: vocabularyId, challenge: challengeId }, { voice_src: voiceSrc }, { upsert: true });
        }
        return true;
    }
};
RecordService = __decorate([
    (0, tsyringe_1.injectable)()
], RecordService);
exports.default = RecordService;
