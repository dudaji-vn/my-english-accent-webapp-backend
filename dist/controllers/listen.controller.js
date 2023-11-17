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
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const listen_service_1 = require("../services/listen.service");
let ListenController = class ListenController {
    constructor(listenService) {
        this.listenService = listenService;
    }
    async getPlaylistListenByLecture(req, res) {
        const payload = req.query;
        payload.favoriteLectureIds = req.user.favorite_lecture_ids;
        payload.favoriteUserIds = req.user.favorite_user_ids;
        const result = await this.listenService.getPlaylistListenByLecture(payload);
        return res.success(result);
    }
    async createOrUpdatePlaylist(req, res) {
        console.log(req.body);
        const payload = req.body;
        payload.userId = req.user._id;
        const result = await this.listenService.createOrUpdatePlaylist(payload);
        return res.success(result);
    }
    async getLecturesAvailable(req, res) {
        const favorite_lecture_ids = req.user.favorite_lecture_ids;
        const result = await this.listenService.getLecturesAvailable(favorite_lecture_ids);
        return res.success(result);
    }
    async getUsersAvailable(req, res) {
        const myFavoriteLectureIds = req.user.favorite_lecture_ids;
        const myFavoriteUserIds = req.user.favorite_user_ids;
        const result = await this.listenService.getUsersAvailable(myFavoriteLectureIds, myFavoriteUserIds);
        return res.success(result);
    }
    async getPlaylistSummary(req, res) {
        const payload = {
            favoriteLectureIds: req.user.favorite_lecture_ids,
            favoriteUserIds: req.user.favorite_user_ids
        };
        const result = await this.listenService.getPlaylistSummary(payload);
        return res.success(result);
    }
};
ListenController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [listen_service_1.ListenService])
], ListenController);
exports.default = ListenController;
