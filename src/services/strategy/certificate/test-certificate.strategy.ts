import { IAddCertificateDTO } from '../../../interfaces/dto/certificate.dto'
import { ICertificateStrategy } from './certificate.strategy'

export class TestCertificateStrategy implements ICertificateStrategy {
  addCertificate(certificate: IAddCertificateDTO): boolean {
    throw new Error('Method not implemented.')
  }
  addContent(args: any[]) {
    return {
      data: args,
      message: 'test certificate'
    }
  }
  getContent() {
    throw new Error('Method not implemented.')
  }
}
