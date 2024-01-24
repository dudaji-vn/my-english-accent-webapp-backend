export interface IUserLoginDTO {
  googleToken: string
  email: string
}
export interface IUserAdminDTO {
  username: string
  password: string
}
export interface IUserDTO {
  userId: string
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

export interface IAddOrUpdateGoogleTranscriptRequest {
  recordId: string
  transcripts: {
    transcript: string
    confidence: number
  }[]
  finalTranscript: string
}

export interface IUpdateProfile {
  userId: string
  nickName: string
  avatarUrl: string
  nativeLanguage: string
}
