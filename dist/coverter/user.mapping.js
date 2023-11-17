"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUserPractice = exports.convertToUserDTOWithoutAuth = exports.convertToUserDTO = exports.convertToUserDAO = void 0;
function convertToUserDAO(user) {
    return {
        avatar_url: user.avatarUrl,
        display_language: user.displayLanguage,
        email: user.email,
        google_id: user.googleId,
        native_language: user.nativeLanguage,
        nick_name: user.nickName
    };
}
exports.convertToUserDAO = convertToUserDAO;
function convertToUserDTO(user) {
    return {
        userId: user._id ?? '',
        avatarUrl: user.avatar_url,
        displayLanguage: user.display_language,
        email: user.email,
        nativeLanguage: user.native_language,
        nickName: user.nick_name
    };
}
exports.convertToUserDTO = convertToUserDTO;
function convertToUserDTOWithoutAuth(user) {
    return {
        userId: user._id ?? '',
        avatarUrl: user.avatar_url,
        displayLanguage: user.display_language,
        nativeLanguage: user.native_language,
        nickName: user.nick_name
    };
}
exports.convertToUserDTOWithoutAuth = convertToUserDTOWithoutAuth;
function convertToUserPractice(item) {
    return {
        lectureId: item.lecture._id,
        lectureName: item.lecture.lecture_name,
        imgSrc: item.lecture.img_src,
        stage: item.stage,
        currentStep: item.current_step,
        enrollmentId: item._id,
        userId: item.user,
        totalStep: item.total_step
    };
}
exports.convertToUserPractice = convertToUserPractice;
