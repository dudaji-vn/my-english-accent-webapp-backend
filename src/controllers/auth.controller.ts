import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import {
  IUserLoginDTO,
  IUserDTO,
  IUserAdminDTO
} from '../interfaces/dto/user.dto'
import AuthService from '../services/auth.service'

@injectable()
export class AuthController {
  constructor(private authService: AuthService) {}
  async login(req: IRequest, res: IResponse) {
    const userRequestDto = req.body as IUserLoginDTO
    const login = await this.authService.login(userRequestDto)
    return res.success(login)
  }
  async register(req: IRequest, res: IResponse) {
    const userRequestDto = req.body as IUserDTO
    const dataRes = await this.authService.register(userRequestDto)
    return res.success(dataRes)
  }
  async getProfile(req: IRequest, res: IResponse) {
    const dataRes = req.user
    return res.success(dataRes)
  }

  async adminLogin(req: IRequest, res: IResponse) {
    const userRequestDto = req.body as IUserAdminDTO
    const login = await this.authService.adminLogin(userRequestDto)
    return res.success(login)
  }
  async adminRegister(req: IRequest, res: IResponse) {
    const userRequestDto = req.body as IUserAdminDTO
    const dataRes = await this.authService.adminRegister(userRequestDto)
    return res.success(dataRes)
  }
  async isLogin(req: IRequest, res: IResponse) {
    const dataRes = await this.authService.isLogin(req.user)
    return res.success(dataRes)
  }
}

export default AuthController
