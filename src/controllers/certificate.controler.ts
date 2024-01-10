import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import CertificateService from '../services/certificate.service'
import { IAddCertificateDTO } from '../interfaces/dto/certificate.dto'

@injectable()
export default class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}
  async getProgress(req: IRequest, res: IResponse) {
    const data = await this.certificateService.getProgress(req.user._id)
    return res.success(data)
  }
  async addCertificate(req: IRequest, res: IResponse) {
    const payload = req.body as IAddCertificateDTO
    const strategyType = payload.strategyType
    const data = await this.certificateService.addCertificate(
      strategyType,
      req.body
    )
    return res.success(data)
  }
  async addContent(req: IRequest, res: IResponse) {
    const strategyType = req.body.type
    const data = await this.certificateService.addContent(
      strategyType,
      req.body
    )
    return res.success(data)
  }
}
