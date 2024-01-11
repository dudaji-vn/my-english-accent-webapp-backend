import {
  IAddCertificateDTO,
  IGetContentDTO
} from '../../../interfaces/dto/certificate.dto'
import { ICertificateStrategy } from './certificate.strategy'

export class TestCertificateStrategy implements ICertificateStrategy {
  getContentById(param: IGetContentDTO) {
    throw new Error('Method not implemented.')
  }
  addCertificate(certificate: IAddCertificateDTO): boolean {
    throw new Error('Method not implemented.')
  }
  addContent(args: any[]) {
    throw new Error('Method not implemented.')
  }
  getContent() {
    throw new Error('Method not implemented.')
  }
}
