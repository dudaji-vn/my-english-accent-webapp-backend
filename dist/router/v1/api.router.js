"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("../../const/path");
const auth_router_1 = __importDefault(require("./auth.router"));
const file_router_1 = __importDefault(require("./file.router"));
const user_router_1 = __importDefault(require("./user.router"));
const script_router_1 = __importDefault(require("./script.router"));
const club_router_1 = __importDefault(require("./club.router"));
const lecture_router_1 = __importDefault(require("./lecture.router"));
const challenge_router_1 = __importDefault(require("./challenge.router"));
const record_router_1 = __importDefault(require("./record.router"));
const vocabulary_router_1 = __importDefault(require("./vocabulary.router"));
const listen_router_1 = __importDefault(require("./listen.router"));
const apiRouterV1 = express_1.default.Router();
const listApi = [
    {
        path: path_1.PATH.auth,
        router: auth_router_1.default
    },
    {
        path: path_1.PATH.user,
        router: user_router_1.default
    },
    {
        path: path_1.PATH.file,
        router: file_router_1.default
    },
    {
        path: path_1.PATH.club,
        router: club_router_1.default
    },
    {
        path: path_1.PATH.script,
        router: script_router_1.default
    },
    {
        path: path_1.PATH.lecture,
        router: lecture_router_1.default
    },
    {
        path: path_1.PATH.challenge,
        router: challenge_router_1.default
    },
    {
        path: path_1.PATH.record,
        router: record_router_1.default
    },
    {
        path: path_1.PATH.vocabulary,
        router: vocabulary_router_1.default
    },
    {
        path: path_1.PATH.listen,
        router: listen_router_1.default
    }
];
listApi.forEach((item) => {
    apiRouterV1.use(item.path, item.router);
});
exports.default = apiRouterV1;
