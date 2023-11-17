"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vocabularySchema = new mongoose_1.default.Schema({
    number_order: { type: Number, default: 0 },
    lecture: { type: mongoose_1.default.Types.ObjectId, ref: 'lecture' },
    phonetic_display_language: {
        type: String,
        required: true
    },
    title_display_language: {
        type: String,
        required: true
    },
    text_translate: {
        vn: {
            type: String,
            required: true
        },
        kr: {
            type: String,
            required: true
        }
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
const VocabularyModel = mongoose_1.default.model('vocabulary', vocabularySchema);
exports.default = VocabularyModel;
