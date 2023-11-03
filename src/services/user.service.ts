import { injectable } from 'tsyringe'
import UserModel from '../entities/User'
import { IUserUpdateDTO } from '../interfaces/dto/user.dto'

@injectable()
export default class UserService {
  async getAll() {
    return await UserModel.find()
  }
  async updateUser(updateData: IUserUpdateDTO, userId: string) {
    return await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true
    })
  }
}
