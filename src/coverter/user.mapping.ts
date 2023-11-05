import { IUserDAO } from '../interfaces/dao/user.dao'

import { IUserDTO, IUserPracticeResponseType } from '../interfaces/dto/user.dto'

export function convertToUserDAO(user: IUserDTO): IUserDAO {
  return {
    avatar_url: user.avatarUrl,
    class: user.class,
    display_language: user.displayLanguage,
    email: user.email,
    google_id: user.googleId,
    native_language: user.nativeLanguage,
    nick_name: user.nickName
  }
}

export function convertToUserDTO(user: IUserDAO): IUserDTO {
  return {
    userId: user._id ?? '',
    avatarUrl: user.avatar_url,
    class: user.class,
    displayLanguage: user.display_language,
    email: user.email,
    googleId: user.google_id,
    nativeLanguage: user.native_language,
    nickName: user.nick_name
  }
}

export function convertToUserPractice(item: any): IUserPracticeResponseType {
  return {
    lectureId: item.lecture._id,
    lectureName: item.lecture.lecture_name,
    imgSrc: item.lecture.img_src,
    stage: item.stage,
    currentStep: item.current_step,
    enrollmentId: item._id,
    userId: item.user
  }
}
