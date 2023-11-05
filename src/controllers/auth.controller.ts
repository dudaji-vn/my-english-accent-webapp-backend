import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import { IUserLoginDTO, IUserDTO } from '../interfaces/dto/user.dto'
import AuthService from '../services/auth.service'

@injectable()
export class AuthController {
  constructor(private authService: AuthService) {}
  async login(req: IRequest, res: IResponse) {
    const userRequestDto = req.body as IUserLoginDTO

    const login = await this.authService.login(userRequestDto)
    const oneDayInSeconds = 7 * 24 * 60 * 60
    const expirationDate = new Date(Date.now() + oneDayInSeconds * 1000)

    return res.success(login)
  }
  async register(req: IRequest, res: IResponse) {
    const userRequestDto = req.body as IUserDTO
    const dataRes = await this.authService.register(userRequestDto)
    const oneDayInSeconds = 7 * 24 * 60 * 60
    const expirationDate = new Date(Date.now() + oneDayInSeconds * 1000)

    return res.success(dataRes)
  }
  async getProfile(req: IRequest, res: IResponse) {
    const dataRes = req.user
    return res.success(dataRes)
  }
}

export default AuthController
