import { injectable } from 'tsyringe'
import CertificateModel from '../entities/certificate.entity'
import {
  CertificateStrategy,
  TNameCertificateStrategy
} from './strategy/certificate/certificate.strategy'
import { VocabularyCertificateStrategy } from './strategy/certificate/vocabulary-certificate.strategy'
import { IAddCertificateDTO } from '../interfaces/dto/certificate.dto'
import UserCertificateModel from '../entities/user-certificate.entity'
@injectable()
export default class CertificateService {
  private certificateStrategy
  constructor() {
    this.certificateStrategy = new CertificateStrategy()
    this.certificateStrategy.use(
      'vocabulary',
      new VocabularyCertificateStrategy()
    )
  }
  async getProgress(userId: string) {
    const archivedCertificate = await UserCertificateModel.find({
      user_id: userId
    })
      .populate('certificate_id')
      .lean()
    const exploreCertificate = await CertificateModel.find({
      _id: { $nin: archivedCertificate.map((item) => item._id.toString()) }
    })
    return exploreCertificate.map((item) => {
      return {
        id: item._id,
        name: item.name,
        type: item.type,
        start: 0,
        totalScore: item.total_score
      }
    })
  }
  addContent<T>(name: TNameCertificateStrategy, data: T) {
    return this.certificateStrategy.addContent(name, data)
  }
  addCertificate(name: TNameCertificateStrategy, data: IAddCertificateDTO) {
    return this.certificateStrategy.addCertificate(name, data)
  }
}
