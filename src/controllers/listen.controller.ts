import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import {
  IPlaylistListen,
  IPlaylistRequest,
  IPlaylistSummary
} from '../interfaces/dto/listen.dto'
import { ListenService } from '../services/listen.service'

@injectable()
export default class ListenController {
  constructor(private readonly listenService: ListenService) {}

  async getPlaylistListenByLecture(req: IRequest, res: IResponse) {
    const payload = req.query as unknown as IPlaylistListen
    payload.favoriteLectureIds = req.user.favorite_lecture_ids
    payload.favoriteUserIds = req.user.favorite_user_ids

    const result = await this.listenService.getPlaylistListenByLecture(payload)
    return res.success(result)
  }
  async createOrUpdatePlaylist(req: IRequest, res: IResponse) {
    console.log(req.body)
    const payload = req.body as IPlaylistRequest
    payload.userId = req.user._id
    const result = await this.listenService.createOrUpdatePlaylist(payload)
    return res.success(result)
  }

  async getLecturesAvailable(req: IRequest, res: IResponse) {
    const result = await this.listenService.getLecturesAvailable()
    return res.success(result)
  }

  async getUsersAvailable(req: IRequest, res: IResponse) {
    const myFavoriteLectureIds = req.user.favorite_lecture_ids
    const result = await this.listenService.getUsersAvailable(
      myFavoriteLectureIds
    )
    return res.success(result)
  }
  async getPlaylistSummary(req: IRequest, res: IResponse) {
    const payload: IPlaylistSummary = {
      favoriteLectureIds: req.user.favorite_lecture_ids,
      favoriteUserIds: req.user.favorite_user_ids
    }

    const result = await this.listenService.getPlaylistSummary(payload)
    return res.success(result)
  }
}
