"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const lectureSchema = new mongoose_1.default.Schema({
    description: {
        type: String
    },
    lecture_name: {
        type: String,
        required: true,
        unique: true
    },
    img_src: {
        type: String,
        default: 'https://res.cloudinary.com/hoquanglinh/image/upload/v1700118507/sudq1kkwlrlfj18afaic.png'
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
const LectureModel = mongoose_1.default.model('lecture', lectureSchema);
exports.default = LectureModel;
