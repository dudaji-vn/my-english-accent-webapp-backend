"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const lecture_service_1 = __importDefault(require("../services/lecture.service"));
let LectureController = class LectureController {
    constructor(lectureService) {
        this.lectureService = lectureService;
    }
    async getAllLectures(req, res) {
        const data = await this.lectureService.getAllLectures();
        return res.success(data);
    }
    async getAllLecturesForAdmin(req, res) {
        const data = await this.lectureService.getAllLecturesForAdmin();
        return res.success(data);
    }
    async addOrUpdateLecture(req, res) {
        const payload = req.body;
        const data = await this.lectureService.addOrUpdateLecture(payload);
        return res.success(data);
    }
};
LectureController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [lecture_service_1.default])
], LectureController);
exports.default = LectureController;
