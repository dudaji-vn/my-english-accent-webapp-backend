import { ICertificateStrategy } from './certificate.strategy'

export class TestCertificateStrategy implements ICertificateStrategy {
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
