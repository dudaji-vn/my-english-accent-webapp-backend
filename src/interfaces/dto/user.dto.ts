import { EClass } from '../../const/common'
import { Language, Role } from '../../entities/User'

export interface IUserLoginDTO {
  googleId: string
  email: string
}
export interface IUserDTO {
  userId: string
  googleId: string
  email: string
  avatarUrl: string
  class: EClass[]
  displayLanguage: string
  nickName: string
  nativeLanguage: string
  userName?: string
  password?: string
}

export interface IUserUpdateDTO {
  avatar?: string
  fullName?: string
  displayName?: string
  role?: Role
  nativeLanguage?: Language
  autoDownload?: boolean
}
export interface IUserEnrollRequest {
  lectureId?: string
  enrollmentId?: string
  totalStep?: number
  user: string
}

export interface IUserPracticeResponseType {
  lectureId: string
  lectureName: string
  imgSrc: string
  stage: number
  currentStep: number
  userId: string
  enrollmentId: string
  totalStep: number
}
