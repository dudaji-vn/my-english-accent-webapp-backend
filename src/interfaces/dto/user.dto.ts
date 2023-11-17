export interface IUserLoginDTO {
  googleId: string
  email: string
}
export interface IUserAdminDTO {
  username: string
  password: string
}
export interface IUserDTO {
  userId: string
  googleId: string
  email: string
  avatarUrl: string
  displayLanguage: string
  nickName: string
  nativeLanguage: string
  userName?: string
  password?: string
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

export interface IEnrollmentResponse {
  stage: number
  currentStep: number
  lectureId: string
  enrollmentId: string
}
