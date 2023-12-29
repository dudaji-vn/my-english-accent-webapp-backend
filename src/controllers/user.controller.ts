import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import {
  IAddOrUpdateGoogleTranscriptRequest,
  IUserEnrollRequest
} from '../interfaces/dto/user.dto'
import UserService from '../services/user.service'

@injectable()
export default class UserController {
  constructor(private readonly userService: UserService) {}
  async getAllUser(req: IRequest, res: IResponse) {
    const me = req.user._id
    const users = await this.userService.getAll(me)
    return res.success(users)
  }

  async addOrUpdateEnrollment(req: IRequest, res: IResponse) {
    const payload = req.body as IUserEnrollRequest
    payload.user = req.user._id
    const result = await this.userService.addOrUpdateEnrollment(payload)
    return res.success(result)
  }
  async getMyPractice(req: IRequest, res: IResponse) {
    const { stage } = req.query
    const result = await this.userService.getMyPractice(
      req.user._id,
      stage as any,
      1
    )
    return res.success(result)
  }
  async checkUserCompleteEvent(req: IRequest, res: IResponse) {
    const { _id, native_language } = req.user
    const result = await this.userService.checkUserWinEvent({
      user_id: _id,
      language: native_language
    })
    return res.success(result)
  }
  async addOrUpdateGoogleTranscript(req: IRequest, res: IResponse) {
    const payload = req.body as IAddOrUpdateGoogleTranscriptRequest

    const result = await this.userService.addOrUpdateGoogleTranscript(payload)
    return res.success(result)
  }
}
