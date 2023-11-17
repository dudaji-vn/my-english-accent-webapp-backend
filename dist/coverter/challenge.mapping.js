"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToChallengeSummary = exports.convertToDetailChallengeDTO = exports.convertToChallengeDisplayDTO = void 0;
function convertToChallengeDisplayDTO(item, club) {
    return {
        challengeId: item._id,
        challengeName: item.challenge_name,
        clubId: item.club,
        clubName: club.club_name,
        created: item.created,
        participants: item.participants,
        updated: item.updated,
        vocabularies: item.vocabularies.map((voca) => {
            return {
                challengeId: voca.challenge,
                vocabularyId: voca._id,
                updated: voca.updated,
                created: voca.created,
                number: voca.number
            };
        })
    };
}
exports.convertToChallengeDisplayDTO = convertToChallengeDisplayDTO;
function convertToDetailChallengeDTO(item) {
    return {
        challengeId: item._id,
        challengeName: item.challenge_name,
        clubId: item.club,
        created: item.created,
        participants: item.participants,
        updated: item.updated,
        vocabularies: item.vocabularies.map((voca) => {
            return {
                challengeId: voca.challenge,
                vocabularyId: voca._id,
                updated: voca.updated,
                created: voca.created,
                number: voca.number,
                vCreated: voca.created,
                vUpdated: voca.updated,
                vphoneticDisplayLanguage: voca.phonetic_display_language,
                vtitleDisplayLanguage: voca.title_display_language,
                lectureId: voca.lecture
            };
        })
    };
}
exports.convertToDetailChallengeDTO = convertToDetailChallengeDTO;
function convertToChallengeSummary(item) {
    return {
        challengeId: item._id,
        challengeName: item.challenge_name,
        clubId: item.club,
        created: item.created,
        updated: item.updated,
        participants: item.challenge?.participants.map((user) => {
            return {
                avatarUrl: user.avatar_url,
                userId: user._id,
                displayLanguage: user.display_language,
                nickName: user.nick_name,
                nativeLanguage: user.native_language
            };
        }),
        vocabularies: item.vocabulary.map((voca) => {
            return {
                record: voca.record,
                challengeId: voca.challenge,
                vocabularyId: voca._id,
                number: voca.number,
                vphoneticDisplayLanguage: voca.phonetic_display_language,
                vtitleDisplayLanguage: voca.title_display_language,
                lectureId: voca.lecture
            };
        })
    };
}
exports.convertToChallengeSummary = convertToChallengeSummary;
