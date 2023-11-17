"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../const/common");
const enrollmentSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Types.ObjectId, ref: 'user' },
    lecture: { type: mongoose_1.default.Types.ObjectId, ref: 'lecture' },
    current_step: {
        type: Number,
        required: true
    },
    stage: {
        type: Number,
        enum: [
            common_1.ENROLLMENT_STAGE.IN_PROGRESS,
            common_1.ENROLLMENT_STAGE.EXPLORE,
            common_1.ENROLLMENT_STAGE.FINISHED
        ],
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
const EnrollmentModel = mongoose_1.default.model('enrollment', enrollmentSchema);
exports.default = EnrollmentModel;
