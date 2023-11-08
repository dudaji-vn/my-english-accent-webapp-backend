import { StageExercise } from '../../const/common'
import { ILectureDTO } from './lecture.dto'
import { IVocabularyDTO } from './vocabulary.dto'

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
  rVoiceSrc: string
}

export interface IVocaByLectureRequest {
  lectureId: string
  stage: StageExercise
  userId: string
}
export interface IRecordByLectureRequest {
  lectureId: string

  userId: string
}
export interface IRecordByLectureDTO extends ILectureDTO {
  vocabularies: IVocabularyDTO[] & IRecordDTO[]
}
