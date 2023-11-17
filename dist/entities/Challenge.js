"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const challengeSchema = new mongoose_1.default.Schema({
    club: { type: mongoose_1.default.Types.ObjectId, ref: 'club' },
    challenge_name: {
        type: String
    },
    participants: [{ type: mongoose_1.default.Types.ObjectId, ref: 'user' }]
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
const ChallengeModel = mongoose_1.default.model('challenge', challengeSchema);
exports.default = ChallengeModel;
