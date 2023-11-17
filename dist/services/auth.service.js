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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_mapping_1 = require("../coverter/user.mapping");
const User_1 = __importDefault(require("../entities/User"));
const error_1 = require("../middleware/error");
const base_service_1 = require("./base.service");
const jwt_service_1 = __importDefault(require("./jwt.service"));
const UserAdmin_1 = __importDefault(require("../entities/UserAdmin"));
let AuthService = class AuthService extends base_service_1.BaseService {
    constructor(jwtService) {
        super();
        this.jwtService = jwtService;
    }
    async login(userDto) {
        const { googleId, email } = userDto;
        if (!googleId || !email) {
            throw new error_1.UnAuthorizeError('user is not register');
        }
        const user = await User_1.default.findOne({
            email: email,
            google_id: googleId
        });
        if (!user) {
            throw new error_1.UnAuthorizeError('user not found');
        }
        const payload = { userId: user._id, email: email };
        const token = this.jwtService.generateAccessToken(payload);
        return {
            token: token,
            user: (0, user_mapping_1.convertToUserDTO)(user)
        };
    }
    async register(userDto) {
        const { email, googleId } = userDto;
        const requiredFields = [
            'googleId',
            'email',
            'nickName',
            'displayLanguage',
            'nativeLanguage'
        ];
        if (!this.checkFieldsExist(userDto, requiredFields)) {
            throw new error_1.BadRequestError('Please input all fields');
        }
        const user = new User_1.default((0, user_mapping_1.convertToUserDAO)(userDto));
        await user.save();
        const payload = { userId: user._id, email: email };
        const token = this.jwtService.generateAccessToken(payload);
        return {
            token: token,
            user: (0, user_mapping_1.convertToUserDTO)(user)
        };
    }
    async adminLogin(userDto) {
        const { username, password } = userDto;
        if (!username || !password) {
            throw new error_1.BadRequestError('username or password not found');
        }
        const user = await UserAdmin_1.default.findOne({
            username: username
        });
        if (!user) {
            throw new error_1.BadRequestError('username not found');
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new error_1.BadRequestError('username or password not correct');
        }
        const payload = { userId: user._id, username: username };
        const token = this.jwtService.generateAccessToken(payload);
        return token;
    }
    async adminRegister(userDto) {
        const { username, password } = userDto;
        if (!username || !password) {
            throw new error_1.BadRequestError('Please input all fields');
        }
        const isExistUser = await UserAdmin_1.default.exists({ user_name: username });
        if (isExistUser) {
            throw new error_1.BadRequestError('email is existed');
        }
        const passwordHash = await bcrypt_1.default.hash(password, 12);
        const user = new UserAdmin_1.default({
            username: username,
            password: passwordHash
        });
        await user.save();
        const payload = { userId: user._id, username: username };
        const token = this.jwtService.generateAccessToken(payload);
        return token;
    }
};
AuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.default])
], AuthService);
exports.default = AuthService;
