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
const Lecture_1 = __importDefault(require("../entities/Lecture"));
const lecture_mapping_1 = require("../coverter/lecture.mapping");
const error_1 = require("../middleware/error");
const Vocabulary_1 = __importDefault(require("../entities/Vocabulary"));
let LectureService = class LectureService {
    async getAllLectures() {
        const vocabularies = await Vocabulary_1.default.find().lean();
        const listLectureIds = vocabularies.map((item) => item.lecture.toString());
        const distinctLectureIds = [...new Set(listLectureIds)];
        const lectures = await Lecture_1.default.find({
            _id: { $in: distinctLectureIds }
        }).sort({ created: -1 });
        return lectures.map((item) => (0, lecture_mapping_1.convertToLectureDTO)(item));
    }
    async getAllLecturesForAdmin() {
        const lectures = await Lecture_1.default.find().sort({ created: -1 });
        return lectures.map((item) => (0, lecture_mapping_1.convertToLectureDTO)(item));
    }
    async addOrUpdateLecture(payload) {
        if (!payload.lectureName || !payload.imgSrc) {
            throw new error_1.BadRequestError('lectureName and imgScr required');
        }
        if (payload.lectureId) {
            await Lecture_1.default.findByIdAndUpdate(payload.lectureId, {
                lecture_name: payload.lectureName,
                img_src: payload.imgSrc
            }, {
                upsert: true
            });
        }
        else {
            const existName = await Lecture_1.default.exists({
                lecture_name: payload.lectureName
            });
            if (existName) {
                throw new error_1.BadRequestError('lectureName is exist');
            }
            await Lecture_1.default.create({
                lecture_name: payload.lectureName,
                img_src: payload.imgSrc
            });
        }
        return true;
    }
};
LectureService = __decorate([
    (0, tsyringe_1.injectable)()
], LectureService);
exports.default = LectureService;
