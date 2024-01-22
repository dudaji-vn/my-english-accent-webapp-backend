import { TNameCertificateStrategy } from '../../services/strategy/certificate/certificate.strategy'

export interface IContentCertificateDTO {
  id: string
  name: string
  imgUrl: string
  archivedImgUrl: string
  totalScore: number
  contents: {
    order: number
    vocabularyId: string
    title: string
    textTranslate: string
    phonetic: string
  }[]
}
export interface IAddCertificateDTO {
  strategyType: TNameCertificateStrategy
  name: string
  imgUrl: string
  archivedImgUrl: string
  totalScore: number
  contents: {
    order: number
    vocabularyId: string
  }[]
}

export interface IGetContentDTO {
  nativeLanguage: string
  certificateId: string
}

export interface IUserCertificateDTO {
  nickName: string
  strategyType: TNameCertificateStrategy
  certificateId: string
  userId: string
  records: [
    {
      vocabularyId: string
      voiceSrc: string
      result: string
    }
  ]
  score: number
  star: number
  correctSentences: number
}
