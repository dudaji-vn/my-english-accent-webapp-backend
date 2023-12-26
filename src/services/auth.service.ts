import { injectable } from 'tsyringe'
import bcrypt from 'bcrypt'
import { convertToUserDAO, convertToUserDTO } from '../coverter/user.mapping'
import UserModel from '../entities/User'
import {
  IUserAdminDTO,
  IUserDTO,
  IUserLoginDTO
} from '../interfaces/dto/user.dto'
import { BadRequestError, UnAuthorizeError } from '../middleware/error'
import { BaseService } from './base.service'
import JwtService from './jwt.service'
import UserAdminModel from '../entities/UserAdmin'

@injectable()
export default class AuthService extends BaseService {
  constructor(private jwtService: JwtService) {
    super()
  }

  async login(userDto: IUserLoginDTO) {
    const { googleId, email } = userDto

    if (!googleId || !email) {
      throw new UnAuthorizeError('user is not register')
    }

    const user = await UserModel.findOne({
      email: email,
      google_id: googleId
    })

    if (!user) {
      throw new UnAuthorizeError('user not found')
    }

    const payload = { userId: user._id, email: email }
    const token = this.jwtService.generateAccessToken(payload)
    return {
      token: token,
      user: convertToUserDTO(user as any)
    }
  }
  async register(userDto: IUserDTO): Promise<any> {
    const { email, googleId } = userDto
    const requiredFields = [
      'googleId',
      'email',
      'nickName',
      'displayLanguage',
      'nativeLanguage'
    ]

    if (!this.checkFieldsExist(userDto, requiredFields)) {
      throw new BadRequestError('Please input all fields')
    }
   const isExistUser = await UserModel.findOne({email:email})
   if(isExistUser) {
    throw new BadRequestError('Email is exist')
   }
    const user = new UserModel(convertToUserDAO(userDto))
    await user.save()
    const payload = { userId: user._id, email: email }
    const token = this.jwtService.generateAccessToken(payload)
    return {
      token: token,
      user: convertToUserDTO(user as any)
    }
  }
  async adminLogin(userDto: IUserAdminDTO): Promise<string> {
    const { username, password } = userDto

    if (!username || !password) {
      throw new BadRequestError('username or password not found')
    }

    const user = await UserAdminModel.findOne({
      username: username
    })

    if (!user) {
      throw new BadRequestError('username not found')
    }
    const isMatch = await bcrypt.compare(password, user.password!)
    if (!isMatch) {
      throw new BadRequestError('username or password not correct')
    }

    const payload = { userId: user._id, username: username }
    const token = this.jwtService.generateAccessToken(payload)
    return token
  }
  async adminRegister(userDto: IUserAdminDTO): Promise<string> {
    const { username, password } = userDto
    if (!username || !password) {
      throw new BadRequestError('Please input all fields')
    }

    const isExistUser = await UserAdminModel.exists({ user_name: username })
    if (isExistUser) {
      throw new BadRequestError('email is existed')
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = new UserAdminModel({
      username: username,
      password: passwordHash
    })
    await user.save()
    const payload = { userId: user._id, username: username }
    const token = this.jwtService.generateAccessToken(payload)
    return token
  }
}
