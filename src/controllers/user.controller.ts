import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import UserService from '../services/user.service'
import { IUserEnrollRequest } from '../interfaces/dto/user.dto'
import { StageExercise } from '../const/common'

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
    const { stage, sort } = req.query
    const result = await this.userService.getMyPractice(
      req.user._id,
      stage as any,
      parseInt((sort ?? 1) as any)
    )
    return res.success(result)
  }
}
