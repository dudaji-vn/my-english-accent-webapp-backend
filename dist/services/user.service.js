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
const enrollment_mapping_1 = require("../coverter/enrollment.mapping");
const user_mapping_1 = require("../coverter/user.mapping");
const Enrollment_1 = __importDefault(require("../entities/Enrollment"));
const Lecture_1 = __importDefault(require("../entities/Lecture"));
const User_1 = __importDefault(require("../entities/User"));
const Vocabulary_1 = __importDefault(require("../entities/Vocabulary"));
const error_1 = require("../middleware/error");
const base_service_1 = require("./base.service");
let UserService = class UserService extends base_service_1.BaseService {
    async getAll(me) {
        const data = await User_1.default.find()
            .find({ _id: { $ne: me } })
            .lean();
        return data.map((item) => (0, user_mapping_1.convertToUserDTO)(item));
    }
    async addOrUpdateEnrollment(payload) {
        const { lectureId, enrollmentId, user } = payload;
        if (!lectureId) {
            throw new error_1.BadRequestError('lectureId is required');
        }
        const totalStep = await Vocabulary_1.default.countDocuments({
            lecture: lectureId
        });
        if (!enrollmentId) {
            if (totalStep === 1) {
                await User_1.default.findByIdAndUpdate(user, { $addToSet: { completed_lecture_ids: [lectureId] } }, { new: true });
            }
            const data = await Enrollment_1.default.findOneAndUpdate({ lecture: lectureId, user: user }, {
                current_step: 1,
                stage: totalStep === 1 ? common_1.StageExercise.Close : common_1.StageExercise.Inprogress,
                user: user
            }, { upsert: true, new: true });
            return (0, enrollment_mapping_1.convertToEnrollmentDTO)(data);
        }
        else {
            const enrollment = await Enrollment_1.default.findById(enrollmentId);
            if (!enrollment) {
                throw new error_1.BadRequestError('enrollmentId not exist');
            }
            const nextStep = enrollment.current_step + 1;
            if (nextStep >= totalStep) {
                await User_1.default.findByIdAndUpdate(user, { $addToSet: { completed_lecture_ids: [lectureId] } }, { new: true });
            }
            const data = await Enrollment_1.default.findByIdAndUpdate(enrollmentId, {
                stage: nextStep >= totalStep
                    ? common_1.StageExercise.Close
                    : common_1.StageExercise.Inprogress,
                current_step: nextStep >= totalStep ? totalStep : nextStep
            }, { new: true });
            return (0, enrollment_mapping_1.convertToEnrollmentDTO)(data);
        }
    }
    async getMyPractice(me, stage, sort) {
        const getLecturesOpen = async () => {
            const aggregateOpenLecture = [
                {
                    $lookup: {
                        from: 'enrollments',
                        localField: '_id',
                        foreignField: 'lecture',
                        as: 'enrollments'
                    }
                },
                {
                    $match: {
                        'enrollments.user': { $ne: new mongoose_1.default.Types.ObjectId(me) }
                    }
                },
                {
                    $lookup: {
                        from: 'vocabularies',
                        localField: '_id',
                        foreignField: 'lecture',
                        as: 'vocabulary'
                    }
                },
                {
                    $addFields: {
                        totalStep: {
                            $size: {
                                $filter: {
                                    input: { $concatArrays: ['$vocabulary'] },
                                    as: 'voc',
                                    cond: { $eq: ['$$voc.lecture', '$_id'] }
                                }
                            }
                        }
                    }
                }
            ];
            try {
                const lectures = await Lecture_1.default.aggregate(aggregateOpenLecture).exec();
                return lectures.map((item) => ({
                    currentStep: 0,
                    enrollmentId: '',
                    imgSrc: item.img_src,
                    lectureId: item._id,
                    lectureName: item.lecture_name,
                    stage: common_1.StageExercise.Open,
                    totalStep: item.totalStep
                }));
            }
            catch (error) {
                console.error('Error in getLecturesOpen:', error);
                throw error;
            }
        };
        const getLecturesInProgress = async () => {
            const enrollmentByUserInprogress = await Enrollment_1.default.find({
                user: me,
                stage: common_1.StageExercise.Inprogress
            })
                .sort({ created: (sort ?? 1) })
                .populate('lecture');
            return await Promise.all(enrollmentByUserInprogress.map(async (item) => {
                const total_step = await Vocabulary_1.default.countDocuments({
                    lecture: item.lecture
                });
                item.total_step = total_step;
                return (0, user_mapping_1.convertToUserPractice)(item);
            }));
        };
        const getLectureClose = async () => {
            const enrollmentByUserClose = await Enrollment_1.default.find({
                user: me,
                stage: common_1.StageExercise.Close
            })
                .sort({ created: (sort ?? 1) })
                .populate('lecture');
            return await Promise.all(enrollmentByUserClose.map(async (item) => {
                const total_step = await Vocabulary_1.default.countDocuments({
                    lecture: item.lecture
                });
                item.total_step = total_step;
                return (0, user_mapping_1.convertToUserPractice)(item);
            }));
        };
        switch (+stage) {
            case common_1.StageExercise.Inprogress:
                return (await getLecturesInProgress()).filter((item) => item.totalStep > 0);
            case common_1.StageExercise.Close:
                return (await getLectureClose()).filter((item) => item.totalStep > 0);
            default:
                return (await getLecturesOpen()).filter((item) => item.totalStep > 0);
        }
    }
};
UserService = __decorate([
    (0, tsyringe_1.injectable)()
], UserService);
exports.default = UserService;
