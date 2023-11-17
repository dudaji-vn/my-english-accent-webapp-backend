"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const clubSchema = new mongoose_1.default.Schema({
    owner_user: { type: mongoose_1.default.Types.ObjectId, ref: 'user' },
    club_name: {
        type: String
    },
    description: {
        type: String
    },
    lectures: [{ type: mongoose_1.default.Types.ObjectId, ref: 'lecture' }],
    members: [{ type: mongoose_1.default.Types.ObjectId, ref: 'user' }]
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
const ClubModel = mongoose_1.default.model('club', clubSchema);
exports.default = ClubModel;
