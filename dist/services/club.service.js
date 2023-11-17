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
const Club_1 = __importDefault(require("../entities/Club"));
const error_1 = require("../middleware/error");
const Challenge_1 = __importDefault(require("../entities/Challenge"));
const ClubVocabulary_1 = __importDefault(require("../entities/ClubVocabulary"));
const Vocabulary_1 = __importDefault(require("../entities/Vocabulary"));
const club_mapping_1 = require("../coverter/club.mapping");
const findRandomIndexWord_1 = require("../common/findRandomIndexWord");
const user_mapping_1 = require("../coverter/user.mapping");
let ClubService = class ClubService {
    async getMembersInfo(clubId) {
        const result = await Club_1.default.findById(clubId)
            .populate('members owner_user')
            .lean();
        if (!result?.members) {
            return [];
        }
        return {
            owner: (0, user_mapping_1.convertToUserDTO)(result.owner_user),
            members: result?.members.map((item) => (0, user_mapping_1.convertToUserDTO)(item))
        };
    }
    async addOrUpdateClub(payload) {
        let clubId;
        if (!payload.ownerUser) {
            throw new error_1.BadRequestError('ownerUserId is required');
        }
        if (!payload.clubId && !payload.members) {
            if (!payload.lectures || payload.lectures.length === 0) {
                throw new error_1.BadRequestError('lectures is required');
            }
            if (!payload.clubName) {
                throw new error_1.BadRequestError('clubName is required');
            }
            const club = await Club_1.default.create({
                club_name: payload.clubName,
                lectures: payload.lectures,
                owner_user: payload.ownerUser
            });
            clubId = club._id;
            const challengePayload = {
                club: club._id,
                challenge_name: 'Word-guessing with colleagues'
            };
            const challenge = await Challenge_1.default.create(challengePayload);
            const vocaList = await Vocabulary_1.default.where({
                lecture: { $in: payload.lectures }
            });
            if (!vocaList || vocaList.length === 0) {
                throw new error_1.BadRequestError('vocalist not found');
            }
            vocaList.forEach(async (item) => {
                await ClubVocabulary_1.default.create({
                    challenge: challenge._id,
                    vocabulary: item._id,
                    number: (0, findRandomIndexWord_1.findRandomIndexWord)(item.title_display_language)
                });
            });
        }
        else {
            await Club_1.default.findByIdAndUpdate(payload.clubId, { $addToSet: { members: payload.members } }, { new: true });
        }
        return clubId || payload.clubId;
    }
    async getClubsOwner(me) {
        const clubsOwner = await Club_1.default.find({
            owner_user: me
        })
            .populate('lectures')
            .sort({ created: -1 });
        const clubJoined = await Club_1.default.find({
            members: { $in: [me] }
        })
            .populate('lectures')
            .sort({ created: -1 });
        return {
            clubsJoined: clubJoined.map((item) => (0, club_mapping_1.convertToGroupDTO)(item)),
            clubsOwner: clubsOwner.map((item) => (0, club_mapping_1.convertToGroupDTO)(item))
        };
    }
    async getDetailClub(clubId) {
        const result = (await Club_1.default.findById(clubId).populate('lectures'));
        return (0, club_mapping_1.convertToGroupDTO)(result);
    }
};
ClubService = __decorate([
    (0, tsyringe_1.injectable)()
], ClubService);
exports.default = ClubService;
