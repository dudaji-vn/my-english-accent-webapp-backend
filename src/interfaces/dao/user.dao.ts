export interface IUserDAO {
  _id?: string
  google_id: string
  email: string
  avatar_url: string
  display_language: string
  nick_name: string
  native_language: string
  favorite_lecture_ids?: string[]
  favorite_user_ids?: string[]
  completed_lecture_ids?: string[]
}
