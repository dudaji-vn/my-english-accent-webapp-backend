import { TNameCertificateStrategy } from '../../services/strategy/certificate/certificate.strategy'

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
