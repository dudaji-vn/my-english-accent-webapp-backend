"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToEnrollmentDTO = void 0;
function convertToEnrollmentDTO(item) {
    return {
        lectureId: item?.lecture,
        stage: item?.stage,
        currentStep: item?.current_step,
        enrollmentId: item?._id
    };
}
exports.convertToEnrollmentDTO = convertToEnrollmentDTO;
