"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userAdminSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});
const UserAdminModel = mongoose_1.default.model('user_admin', userAdminSchema);
exports.default = UserAdminModel;
