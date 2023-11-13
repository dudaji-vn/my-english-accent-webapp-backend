import { EClass } from '../../const/common'

export interface IUserDAO {
  _id?: string
  google_id: string
  email: string
  avatar_url: string
  display_language: string
  nick_name: string
  native_language: string
}
