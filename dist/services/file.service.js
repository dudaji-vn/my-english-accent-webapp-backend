"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastCsv = __importStar(require("fast-csv"));
const fs_1 = __importDefault(require("fs"));
const tsyringe_1 = require("tsyringe");
const Lecture_1 = __importDefault(require("../entities/Lecture"));
const Vocabulary_1 = __importDefault(require("../entities/Vocabulary"));
let FileService = class FileService {
    async parseCsvRow(row) {
        const [numberOrder, lectureName, wordOrExpression, phonetic, textKorean, textVietNam] = row;
        if (parseInt(numberOrder) > 0 &&
            lectureName &&
            wordOrExpression &&
            textKorean &&
            textVietNam &&
            phonetic) {
            return {
                numberOrder: parseInt(numberOrder),
                textTranslate: {
                    vn: textVietNam,
                    kr: textKorean
                },
                titleDisplayLanguage: wordOrExpression,
                lectureName: lectureName,
                phonetic: phonetic
            };
        }
    }
    async processCsvFile(source) {
        const stream = fs_1.default.createReadStream(source);
        const parser = fastCsv.parseStream(stream);
        const listItems = [];
        parser.on('data', async (row) => {
            const parsedRow = await this.parseCsvRow(row);
            if (parsedRow) {
                listItems.push(parsedRow);
            }
        });
        await new Promise((resolve) => {
            parser.on('end', resolve);
        });
        return listItems;
    }
    async importDataFromExcel() {
        const result = await this.handleStoreFile('./resource/MEA-Voca-Lecture-23-11.csv');
        return result;
    }
    async handleStoreFile(source) {
        const vocabulariesData = await this.processCsvFile(source);
        let listLectureName = vocabulariesData.map((item) => item.lectureName);
        const existedLectures = (await Lecture_1.default.find().lean()).map((item) => item.lecture_name);
        const needSaveLectures = [...new Set(listLectureName)]
            .filter((lecture) => !existedLectures.includes(lecture))
            .map((item) => {
            return {
                lecture_name: item
            };
        });
        if (needSaveLectures && needSaveLectures.length > 0) {
            await Lecture_1.default.insertMany(needSaveLectures);
        }
        const lectures = await Lecture_1.default.find().lean();
        const existedVocabularies = await Vocabulary_1.default.find().lean();
        const vocabulariesNeedSave = vocabulariesData
            .map((voca) => {
            const lectureId = lectures
                .find((lecture) => lecture.lecture_name === voca.lectureName)
                ?._id.toString();
            if (lectureId) {
                return {
                    lecture: lectureId,
                    phonetic_display_language: voca.phonetic,
                    text_translate: voca.textTranslate,
                    title_display_language: voca.titleDisplayLanguage,
                    number_order: voca.numberOrder
                };
            }
        })
            .filter((item) => item?.lecture &&
            item.number_order &&
            item.phonetic_display_language &&
            item.text_translate &&
            item.title_display_language)
            .filter((item) => !existedVocabularies.find((voca) => voca.title_display_language === item?.title_display_language &&
            voca?.lecture?.toString() === item.lecture));
        const vocaImports = await Vocabulary_1.default.insertMany(vocabulariesNeedSave);
        return vocaImports;
    }
};
FileService = __decorate([
    (0, tsyringe_1.injectable)()
], FileService);
exports.default = FileService;
