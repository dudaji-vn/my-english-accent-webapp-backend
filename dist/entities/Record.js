"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const recordSchema = new mongoose_1.default.Schema({
    challenge: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'challenge',
        default: null
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'user'
    },
    vocabulary: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'vocabulary'
    },
    voice_src: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
const RecordModel = mongoose_1.default.model('record', recordSchema);
exports.default = RecordModel;
