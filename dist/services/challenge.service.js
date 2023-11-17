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
// @ts-nocheck
const tsyringe_1 = require("tsyringe");
const mongoose_1 = __importDefault(require("mongoose"));
const Challenge_1 = __importDefault(require("../entities/Challenge"));
const challenge_mapping_1 = require("../coverter/challenge.mapping");
const Record_1 = __importDefault(require("../entities/Record"));
const ClubVocabulary_1 = __importDefault(require("../entities/ClubVocabulary"));
const vocabulary_mapping_1 = require("../coverter/vocabulary.mapping");
const user_mapping_1 = require("../coverter/user.mapping");
const Club_1 = __importDefault(require("../entities/Club"));
let ChallengeService = class ChallengeService {
    async getChallengesInClub(clubId) {
        const club = await Club_1.default.findById(clubId).lean();
        const query = [
            {
                $match: {
                    club: new mongoose_1.default.Types.ObjectId(clubId)
                }
            },
            {
                $lookup: {
                    from: 'club_vocabularies',
                    localField: '_id',
                    foreignField: 'challenge',
                    as: 'vocabularies'
                }
            }
        ];
        const data = await Challenge_1.default.aggregate(query);
        return data.map((item) => (0, challenge_mapping_1.convertToChallengeDisplayDTO)(item, club));
    }
    async getChallengeDetailInClub(challengeId) {
        const query = [
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(challengeId)
                }
            },
            {
                $lookup: {
                    from: 'club_vocabularies',
                    localField: '_id',
                    foreignField: 'challenge',
                    as: 'club_vocabularies'
                }
            },
            {
                $lookup: {
                    from: 'vocabularies',
                    localField: 'club_vocabularies.vocabulary',
                    foreignField: '_id',
                    as: 'vocabularies'
                }
            }
        ];
        const data = await Challenge_1.default.aggregate(query);
        return data.map((item) => (0, challenge_mapping_1.convertToDetailChallengeDTO)(item)).shift();
    }
    async getAllRecordInChallenge(challengeId, userId) {
        const challengeInfo = await Challenge_1.default.findById(challengeId)
            .populate('participants')
            .lean();
        const records = await Record_1.default.find({
            challenge: challengeId,
            user: new mongoose_1.default.Types.ObjectId(userId)
        }).populate('vocabulary');
        return {
            challengeName: challengeInfo?.challenge_name,
            clubId: challengeInfo?.club,
            participants: challengeInfo?.participants.map((item) => (0, user_mapping_1.convertToUserDTO)(item)),
            challengeId: challengeInfo?._id,
            vocabularies: records.map((item) => (0, vocabulary_mapping_1.convertToVocabularyWithRecordedDTO)(item))
        };
    }
    async updateChallengeMember(challengeId, me) {
        await Challenge_1.default.findByIdAndUpdate(challengeId, { $addToSet: { participants: [me] } }, { new: true });
        return challengeId;
    }
    async getRecordToListenByChallenge(challengeId, me) {
        const vocabularies = await ClubVocabulary_1.default.find({
            challenge: challengeId
        }).populate('vocabulary');
        let participants = [];
        const challengeById = await Challenge_1.default.findById(challengeId).populate('participants');
        if (!challengeById || challengeById.participants.length == 0) {
            participants = [];
        }
        else {
            const userIds = challengeById.participants.map((item) => item?._id.toString());
            const participantsVoca = vocabularies.map((voca) => {
                return voca.vocabulary._id.toString();
            });
            const records = await Record_1.default.find({
                user: { $in: userIds },
                vocabulary: { $in: participantsVoca },
                challenge: challengeId
            }).populate('user');
            participants = vocabularies.map((voca) => {
                const recordUser = records.filter((item) => item.vocabulary._id.toString() === voca.vocabulary._id.toString());
                return {
                    lectureId: voca?.vocabulary?.lecture,
                    vCreated: voca?.vocabulary?.created,
                    vocabularyId: voca?.vocabulary._id,
                    vphoneticDisplayLanguage: voca?.vocabulary?.phonetic_display_language,
                    vtitleDisplayLanguage: voca?.vocabulary?.title_display_language,
                    vUpdated: voca?.vocabulary?.updated,
                    recordUser: recordUser.map((item) => (0, vocabulary_mapping_1.convertToRecordOfUser)(item))
                };
            });
        }
        return {
            vocabularies: vocabularies.map((item) => (0, vocabulary_mapping_1.convertToVocabularyDTO)(item.vocabulary)),
            participants: participants
        };
    }
};
ChallengeService = __decorate([
    (0, tsyringe_1.injectable)()
], ChallengeService);
exports.default = ChallengeService;
