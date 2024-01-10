import { injectable } from 'tsyringe'
import CertificateModel from '../entities/certificate.entity'
import {
  CertificateStrategy,
  TNameCertificateStrategy
} from './strategy/certificate/certificate.strategy'
import { VocabularyCertificateStrategy } from './strategy/certificate/vocabulary-certificate.strategy'
import { TestCertificateStrategy } from './strategy/certificate/test-certificate.strategy'
@injectable()
export default class CertificateService {
  private certificateStrategy
  constructor() {
    this.certificateStrategy = new CertificateStrategy()
    this.certificateStrategy.use(
      'vocabulary',
      new VocabularyCertificateStrategy()
    )
    this.certificateStrategy.use('test', new TestCertificateStrategy())
  }
  getAllByUser(userId: string) {
    return CertificateModel.find({
      user_id: userId
    })
  }
  addContent<T>(name: TNameCertificateStrategy, data: T) {
    return this.certificateStrategy.addContent(name, data)
  }
}
