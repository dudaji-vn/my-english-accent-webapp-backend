"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToRecordOfUser = exports.convertToDetailVocabularyByLecture = exports.convertToVocabularyWithRecordedDTO = exports.convertToVocabularyWithTranslateDTO = exports.convertToVocabularyDTO = void 0;
function convertToVocabularyDTO(voca) {
    return {
        vocabularyId: voca._id,
        vCreated: voca.created,
        vUpdated: voca.updated,
        vphoneticDisplayLanguage: voca.phonetic_display_language,
        vtitleDisplayLanguage: voca.title_display_language,
        lectureId: voca.lecture,
        numberOrder: voca.number_order
    };
}
exports.convertToVocabularyDTO = convertToVocabularyDTO;
function convertToVocabularyWithTranslateDTO(voca, nativeLanguage) {
    return {
        vocabularyId: voca._id,
        vCreated: voca.created,
        vUpdated: voca.updated,
        vphoneticDisplayLanguage: voca.phonetic_display_language,
        vtitleDisplayLanguage: voca.title_display_language,
        lectureId: voca.lecture,
        numberOrder: voca.number_order,
        language: nativeLanguage,
        titleNativeLanguage: nativeLanguage === 'kr'
            ? voca?.text_translate?.kr
            : voca?.text_translate?.vn
    };
}
exports.convertToVocabularyWithTranslateDTO = convertToVocabularyWithTranslateDTO;
function convertToVocabularyWithRecordedDTO(item, nativeLanguage) {
    return {
        vocabularyId: item.vocabulary._id,
        vCreated: item.vocabulary.created,
        vUpdated: item.vocabulary.updated,
        vphoneticDisplayLanguage: item.vocabulary.phonetic_display_language,
        vtitleDisplayLanguage: item.vocabulary.title_display_language,
        lectureId: item.vocabulary.lecture,
        language: nativeLanguage ?? 'vn',
        titleNativeLanguage: nativeLanguage === 'kr'
            ? item?.vocabulary?.text_translate?.kr
            : item?.vocabulary?.text_translate?.vn,
        voiceSrc: item?.vocabulary.voice_src ?? '',
        recordId: item?.vocabulary.record_id ?? ''
    };
}
exports.convertToVocabularyWithRecordedDTO = convertToVocabularyWithRecordedDTO;
function convertToDetailVocabularyByLecture(item) {
    return {
        textVN: item?.text_translate?.vn,
        textKR: item?.text_translate?.kr,
        vocabularyId: item._id,
        numberOrder: item.number_order ?? 0,
        lectureName: item?.lecture?.lecture_name,
        titleDisplay: item.title_display_language,
        phonetic: item.phonetic_display_language
    };
}
exports.convertToDetailVocabularyByLecture = convertToDetailVocabularyByLecture;
function convertToRecordOfUser(item) {
    return {
        avatarUrl: item.user.avatar_url,
        challengeId: item.challenge,
        displayLanguage: item.user.display_language,
        nativeLanguage: item.user.native_language,
        nickName: item.user.nick_name,
        rCreated: item.created,
        recordId: item._id,
        rUpdated: item.updated,
        voiceSrc: item.voice_src,
        userId: item.user._id,
        vocabularyId: item.vocabulary
    };
}
exports.convertToRecordOfUser = convertToRecordOfUser;
