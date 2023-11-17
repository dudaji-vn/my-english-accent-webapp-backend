"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    google_id: {
        type: String,
        required: true
    },
    avatar_url: {
        type: String
    },
    nick_name: {
        type: String,
        required: true
    },
    native_language: {
        type: String,
        enum: ['vn', 'kr', 'us'],
        required: true
    },
    display_language: {
        type: String,
        required: true
    },
    user_name: {
        type: String
    },
    password: {
        type: String
    },
    completed_lecture_ids: {
        type: [{ type: mongoose_1.default.Types.ObjectId, ref: 'lecture' }],
        default: []
    },
    favorite_user_ids: {
        type: [{ type: mongoose_1.default.Types.ObjectId, ref: 'user' }],
        default: []
    },
    favorite_lecture_ids: {
        type: [{ type: mongoose_1.default.Types.ObjectId, ref: 'lecture' }],
        default: []
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
const UserModel = mongoose_1.default.model('user', userSchema);
exports.default = UserModel;
