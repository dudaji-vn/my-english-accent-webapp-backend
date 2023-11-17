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
const Vocabulary_1 = __importDefault(require("../entities/Vocabulary"));
let ScriptService = class ScriptService {
    async initData() {
        const lectures = [
            {
                lecture_name: 'Terminology in IT english',
                img_src: 'https://cdn-icons-png.flaticon.com/512/3285/3285819.png'
            },
            {
                lecture_name: 'Programming Language',
                img_src: 'https://cdn-icons-png.flaticon.com/512/2721/2721614.png'
            },
            {
                lecture_name: 'Acronym in IT English',
                img_src: 'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
            },
            {
                lecture_name: 'Git - advanced 1',
                img_src: 'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
            },
            {
                lecture_name: 'Code review 1',
                img_src: 'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
            },
            {
                lecture_name: 'Code review 2',
                img_src: 'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
            },
            {
                lecture_name: 'Git - Basic 1',
                img_src: 'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
            }
        ];
        for (const lecture of lectures) {
            await Lecture_1.default.findOneAndUpdate({ lecture_name: lecture.lecture_name }, lecture, { upsert: true });
        }
        const vocabularies = [
            {
                class: 0,
                lecture: '6540bd721860dada50828c4d',
                phonetic_display_language: `/ˈɛksɪˌkjut ðə ˈproʊˌɡræm ənd si ðə rɪˈzʌlt/`,
                title_display_language: 'Execute the program and see the result.',
                title_native_language: 'Thực thi chương trình và xem kết quả',
                native_language: 'vn'
            },
            {
                class: 0,
                lecture: '6540bd721860dada50828cad',
                phonetic_display_language: `/diː-ɛn-ɛs - dəʊˈmeɪn neɪm ˈsɪstəm/`,
                title_display_language: 'DNS - Domain Name System',
                title_native_language: 'Hệ thống tên miền',
                native_language: 'vn'
            },
            {
                class: 0,
                lecture: '6540bd721860dada50828c4d',
                phonetic_display_language: `/ˌriːjuːzəˈbɪləti ɪz wʌn ʌv ðə ki ˈfæktərz ɪn dɪˈzaɪnɪŋ greɪt kəmˈpoʊnənts/`,
                title_display_language: 'Reusability is one of the key factors in designing great components.',
                title_native_language: 'Tái sử dụng',
                native_language: 'vn'
            },
            {
                class: 1,
                lecture: '6540bd721860dada50828cad',
                phonetic_display_language: `/ˌriːjuːzəˈbɪləti ɪz wʌn ʌv ðə ki ˈfæktərz ɪn dɪˈzaɪnɪŋ greɪt kəmˈpoʊnənts/`,
                title_display_language: 'Test',
                title_native_language: 'Kiểm thử',
                native_language: 'vn'
            },
            {
                class: 1,
                lecture: '6540bd721860dada50828cad',
                phonetic_display_language: `/ˌriːjuːzəˈbɪləti ɪz wʌn ʌv ðə ki ˈfæktərz ɪn dɪˈzaɪnɪŋ greɪt kəmˈpoʊnənts/`,
                title_display_language: 'Test',
                title_native_language: 'Kiểm thử'
            }
        ];
        for (const item of vocabularies) {
            const voca = await Vocabulary_1.default.findOneAndUpdate({ title_display_language: item.title_display_language }, item, { upsert: true });
        }
        const vocabulariesData = await Vocabulary_1.default.find();
        return 'Init data';
    }
};
ScriptService = __decorate([
    (0, tsyringe_1.injectable)()
], ScriptService);
exports.default = ScriptService;
