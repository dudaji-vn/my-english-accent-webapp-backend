import { ICertificateStrategy } from './certificate.strategy'

export class VocabularyCertificateStrategy implements ICertificateStrategy {
  addContent(args: any[]) {
    console.log('add logic content voca')
    return {
      data: args,
      message: 'vocabulary'
    }
  }
  getContent() {
    throw new Error('Method not implemented.')
  }
}
