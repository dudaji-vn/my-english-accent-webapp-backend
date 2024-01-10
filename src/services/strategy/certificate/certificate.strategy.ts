export interface ICertificateStrategy {
  addContent(args: any[]): any
  getContent(): any
}
export type TNameCertificateStrategy = 'vocabulary' | 'test'
export class CertificateStrategy {
  strategies: Record<string, ICertificateStrategy> = {}
  use(name: TNameCertificateStrategy, strategy: ICertificateStrategy) {
    this.strategies[name] = strategy
  }
  addContent(name: TNameCertificateStrategy, ...args: any) {
    if (!this.strategies[name]) {
      throw new Error('Certificate name has not been set')
    }
    return this.strategies[name].addContent.apply(null, args)
  }
}
