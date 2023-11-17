"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToRecordsByLectureDTO = void 0;
const convertToRecordsByLectureDTO = (item) => {
    return {
        imgSrc: item.img_src,
        lectureName: item.lecture_name,
        lectureId: item._id,
        vocabularies: item?.vocabularies
            .filter((item) => item.record)
            .map((voca) => {
            return {
                vCreated: voca.created,
                vphoneticDisplayLanguage: voca.phonetic_display_language,
                vtitleDisplayLanguage: voca.title_display_language,
                lectureId: voca.lecture,
                vUpdated: voca.updated,
                vocabularyId: voca._id,
                recordId: voca.record._id,
                challengeId: voca.record.challenge,
                rCreated: voca.record.created,
                rUpdated: voca.record.updated,
                userId: voca.record.user,
                voiceSrc: voca.record.voice_src
            };
        })
    };
};
exports.convertToRecordsByLectureDTO = convertToRecordsByLectureDTO;
