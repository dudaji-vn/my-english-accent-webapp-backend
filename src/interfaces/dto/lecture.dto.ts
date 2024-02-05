import { IVocabularyRequest } from './vocabulary.dto'

export interface ILectureDTO {
  lectureId?: string
  lectureName: string
  imgSrc: string
  status?: string
  created?: Date
  published?: Date
  updated?: Date
}
export interface IFormLectureAndVocabularyRequest {
  lectureId: string
  status: 'Draft' | 'Published'
  lectureName: string
  imgSrc: string
  listVocabulary: IVocabularyRequest[]
}

export interface IChangeStatusLectureRequest {
  lectureId: string
  status: 'Draft' | 'Published'
}
