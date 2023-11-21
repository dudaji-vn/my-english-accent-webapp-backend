"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenService = void 0;
// @ts-nocheck
const common_1 = require("../const/common");
const lecture_mapping_1 = require("../coverter/lecture.mapping");
const user_mapping_1 = require("../coverter/user.mapping");
const vocabulary_mapping_1 = require("../coverter/vocabulary.mapping");
const Enrollment_1 = __importDefault(require("../entities/Enrollment"));
const Lecture_1 = __importDefault(require("../entities/Lecture"));
const Record_1 = __importDefault(require("../entities/Record"));
const User_1 = __importDefault(require("../entities/User"));
const Vocabulary_1 = __importDefault(require("../entities/Vocabulary"));
class ListenService {
    async createOrUpdatePlaylist(payload) {
        const { favoriteLectureIds, favoriteUserIds, userId } = payload;
        if (favoriteLectureIds && favoriteLectureIds.length > 0) {
            await User_1.default.findByIdAndUpdate(userId, { favorite_lecture_ids: favoriteLectureIds }, { new: true });
        }
        if (favoriteUserIds && favoriteUserIds.length > 0) {
            await User_1.default.findByIdAndUpdate(userId, { favorite_user_ids: favoriteUserIds }, { new: true });
        }
        return true;
    }
    async getPlaylistListenByLecture(payload) {
        const { favoriteUserIds, lectureId } = payload;
        const lecture = await Lecture_1.default.findById(lectureId);
        const vocabulariesByLectureId = await Vocabulary_1.default.find({
            lecture: lectureId
        }).sort({ number_order: 1 });
        const userFinishedLecture = await Enrollment_1.default.find({
            user: { $in: favoriteUserIds },
            stage: common_1.StageExercise.Close
        }).lean();
        const userIds = userFinishedLecture.map((item) => item.user.toString());
        const records = await Record_1.default.find({
            user: { $in: userIds },
            challenge: null
        }).populate({
            path: 'user',
            options: { sort: { nick_name: -1 } }
        });
        const participants = vocabulariesByLectureId.map((voca) => {
            const recordUser = records.filter((item) => item.vocabulary.toString() === voca._id.toString());
            return {
                ...(0, vocabulary_mapping_1.convertToVocabularyDTO)(voca),
                recordUser: recordUser
                    .map((item) => (0, vocabulary_mapping_1.convertToRecordOfUser)(item))
                    .sort((a, b) => a.nickName.localeCompare(b.nickName))
            };
        });
        return {
            lecture: (0, lecture_mapping_1.convertToLectureDTO)(lecture),
            vocabularies: vocabulariesByLectureId.map((item) => (0, vocabulary_mapping_1.convertToVocabularyDTO)(item)),
            participants: participants
        };
    }
    async getLecturesAvailable(favorite_lecture_ids) {
        const aggQuery = [
            {
                $lookup: {
                    from: 'lectures',
                    localField: 'lecture',
                    foreignField: '_id',
                    as: 'lectureInfo'
                }
            },
            {
                $unwind: '$lectureInfo'
            },
            {
                $group: {
                    _id: {
                        lectureId: '$lectureInfo._id',
                        lectureName: '$lectureInfo.lecture_name'
                    },
                    vocabularies: { $push: '$$ROOT' },
                    totalVocabularies: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    lectureId: '$_id.lectureId',
                    lectureName: '$_id.lectureName',
                    vocabularies: 1,
                    totalVocabularies: 1
                }
            },
            {
                $sort: {
                    lectureName: 1
                }
            }
        ];
        const data = await Vocabulary_1.default.aggregate(aggQuery);
        const records = await Record_1.default.find({ challenge: null });
        return data
            .map((item) => {
            let totalPeople = 0;
            const listVocaIds = item.vocabularies.map((voca) => voca._id.toString());
            const recordsByLectures = records.filter((record) => listVocaIds.includes(record?.vocabulary?.toString()));
            let usersRecorded = {};
            recordsByLectures.forEach((item) => {
                if (!usersRecorded[item.user._id]) {
                    usersRecorded[item.user._id] = 1;
                }
                else {
                    usersRecorded[item.user._id] += 1;
                }
            });
            for (const i in usersRecorded) {
                if (usersRecorded.hasOwnProperty(i) &&
                    usersRecorded[i] === item.totalVocabularies) {
                    totalPeople += 1;
                }
            }
            return {
                totalPeople: totalPeople,
                totalVocabularies: item.totalVocabularies,
                lectureId: item.lectureId,
                lectureName: item.lectureName,
                isSelected: favorite_lecture_ids
                    .map((item) => item.toString())
                    .includes(item.lectureId.toString())
            };
        })
            .sort((a, b) => Number(b.isSelected) - Number(a.isSelected) ||
            b.totalPeople * b.totalVocabularies -
                a.totalPeople * a.totalVocabularies);
    }
    async getUsersAvailable(myFavoriteLectureIds, myFavoriteUserIds) {
        const users = await User_1.default.find().lean().sort({ nick_name: 1 });
        return users
            .map((user) => {
            let selectedLectures = [];
            if (user.completed_lecture_ids) {
                selectedLectures = myFavoriteLectureIds.filter((item) => user.completed_lecture_ids
                    .map((item) => item.toString())
                    .includes(item.toString()));
            }
            return {
                numberSelectedLectures: selectedLectures.length,
                numberCompletedLectures: user.completed_lecture_ids.length,
                isSelected: myFavoriteUserIds
                    .map((item) => item.toString())
                    .includes(user._id.toString()),
                ...(0, user_mapping_1.convertToUserDTOWithoutAuth)(user)
            };
        })
            .sort((a, b) => Number(b.isSelected) - Number(a.isSelected) ||
            b.numberCompletedLectures - a.numberCompletedLectures);
    }
    async getPlaylistSummary(payload) {
        const { favoriteLectureIds, favoriteUserIds } = payload;
        const lectures = await Lecture_1.default.find({
            _id: { $in: favoriteLectureIds }
        });
        return {
            totalLecture: favoriteLectureIds.length,
            totalPeople: favoriteUserIds.length,
            lectures: lectures.map((item) => (0, lecture_mapping_1.convertToLectureDTO)(item))
        };
    }
}
exports.ListenService = ListenService;
