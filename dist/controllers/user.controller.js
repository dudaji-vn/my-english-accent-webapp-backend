"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const user_service_1 = __importDefault(require("../services/user.service"));
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUser(req, res) {
        const me = req.user._id;
        const users = await this.userService.getAll(me);
        return res.success(users);
    }
    async addOrUpdateEnrollment(req, res) {
        const payload = req.body;
        payload.user = req.user._id;
        const result = await this.userService.addOrUpdateEnrollment(payload);
        return res.success(result);
    }
    async getMyPractice(req, res) {
        const { stage, sort } = req.query;
        const result = await this.userService.getMyPractice(req.user._id, stage, parseInt((sort ?? 1)));
        return res.success(result);
    }
};
UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [user_service_1.default])
], UserController);
exports.default = UserController;
