"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
//const jwt = require('jsonwebtoken')
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let JwtService = class JwtService {
    generateAccessToken(payload) {
        const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!tokenSecret) {
            throw new Error('Cannot find tokenSecret');
        }
        return jsonwebtoken_1.default.sign(payload, tokenSecret, {
            algorithm: 'HS256',
            expiresIn: '30d'
        });
    }
};
JwtService = __decorate([
    (0, tsyringe_1.injectable)()
], JwtService);
exports.default = JwtService;
