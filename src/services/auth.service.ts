import { injectable } from 'tsyringe'
import {
  convertToUserDAO,
  convertToUserDTO
} from '../coverter/user.mapping'
import UserModel from '../entities/User'
import { IUserDTO, IUserLoginDTO } from '../interfaces/dto/user.dto'
import {
  BadRequestError,
  UnAuthorizeError
} from '../middleware/error'
import { BaseService } from './base.service'
import JwtService from './jwt.service'

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
      // 'class'
    ]

    if (!this.checkFieldsExist(userDto, requiredFields)) {
      throw new BadRequestError('Please input all fields')
    }
    // if (userDto.class) {
    //   userDto.class.forEach((item) => {
    //     if (
    //       ![
    //         EClass.Designer,
    //         EClass.Developer,
    //         EClass.General
    //       ].includes(item)
    //     ) {
    //       throw new BadRequestError('class is not valid')
    //     }
    //   })
    // }
    // const isExistUser = await UserModel.exists({
    //   $or: [{ email: email }, { googleId: googleId }]
    // })

    // if (isExistUser) {
    //   throw new BadRequestError('email or googleId is existed')
    // }

    const user = new UserModel(convertToUserDAO(userDto))
    await user.save()
    const payload = { userId: user._id, email: email }
    const token = this.jwtService.generateAccessToken(payload)
    return {
      token: token,
      user: convertToUserDTO(user as any)
    }
  }
}
