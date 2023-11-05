import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import UserService from '../services/user.service'
import { IUserEnrollRequest } from '../interfaces/dto/user.dto'

@injectable()
export default class UserController {
  constructor(private readonly userService: UserService) {}
  async getAllUser(req: IRequest, res: IResponse) {
    const users = await this.userService.getAll()
    return res.success(users)
  }

  async addOrUpdateEnrollment(req: IRequest, res: IResponse) {
    const payload = req.body as IUserEnrollRequest
    payload.user = req.user._id
    const result = await this.userService.addOrUpdateEnrollment(payload)
    return res.success(result)
  }
  async getMyPractice(req: IRequest, res: IResponse) {
    const result = await this.userService.getMyPractice(req.user._id)
    return res.success(result)
  }
}
