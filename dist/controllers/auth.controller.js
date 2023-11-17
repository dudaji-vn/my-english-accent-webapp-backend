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
exports.AuthController = void 0;
const tsyringe_1 = require("tsyringe");
const auth_service_1 = __importDefault(require("../services/auth.service"));
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res) {
        const userRequestDto = req.body;
        const login = await this.authService.login(userRequestDto);
        return res.success(login);
    }
    async register(req, res) {
        const userRequestDto = req.body;
        const dataRes = await this.authService.register(userRequestDto);
        return res.success(dataRes);
    }
    async getProfile(req, res) {
        const dataRes = req.user;
        return res.success(dataRes);
    }
    async adminLogin(req, res) {
        const userRequestDto = req.body;
        const login = await this.authService.adminLogin(userRequestDto);
        return res.success(login);
    }
    async adminRegister(req, res) {
        const userRequestDto = req.body;
        const dataRes = await this.authService.adminRegister(userRequestDto);
        return res.success(dataRes);
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [auth_service_1.default])
], AuthController);
exports.default = AuthController;
