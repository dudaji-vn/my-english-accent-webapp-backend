import { ILectureDTO } from './lecture.dto'
import { IUserDTO } from './user.dto'
import { IVocabularyDTO, Language } from './vocabulary.dto'

export interface IRecordRequest {
  userId: string
  voiceSrc: string
  vocabularyId: string
  challengeId: string | null
  recordId?: string
}
export interface IRecordDTO {
  recordId: string
  challengeId: string | null
  rCreated: string
  rUpdated: string
  userId: string
  vocabularyId: string
  voiceSrc: string
}

export interface IVocaByLectureRequest {
  lectureId: string
  userId: string
  nativeLanguage?: Language
}
export interface IRecordByLectureRequest {
  lectureId: string

  userId: string
}
export interface IRecordByLectureDTO extends ILectureDTO {
  vocabularies: IVocabularyDTO[] & IRecordDTO[]
}

export interface IRecordOfUser extends IVocabularyDTO {
  recordUser: Omit<IUserDTO & IRecordDTO, 'email'>[]
}

export interface IRecordToListen {
  participants: IRecordOfUser[]
  vocabularies: IVocabularyDTO[]
}
