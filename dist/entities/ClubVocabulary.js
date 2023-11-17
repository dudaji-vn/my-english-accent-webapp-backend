"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const clubVocabularySchema = new mongoose_1.default.Schema({
    challenge: { type: mongoose_1.default.Types.ObjectId, ref: 'challenge' },
    number: {
        type: Number
    },
    vocabulary: { type: mongoose_1.default.Types.ObjectId, ref: 'vocabulary' }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
const ClubVocabularyModel = mongoose_1.default.model('club_vocabulary', clubVocabularySchema);
exports.default = ClubVocabularyModel;
