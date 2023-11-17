"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToLectureDTO = void 0;
const convertToLectureDTO = (lecture) => {
    return {
        lectureId: lecture._id,
        imgSrc: lecture.img_src,
        lectureName: lecture.lecture_name
    };
};
exports.convertToLectureDTO = convertToLectureDTO;
