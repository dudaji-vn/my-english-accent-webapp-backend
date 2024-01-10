import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import CertificateService from '../services/certificate.service'

@injectable()
export default class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}
  async getAllByUser(req: IRequest, res: IResponse) {
    const data = await this.certificateService.getAllByUser(req.user._id)
    return res.success(data)
  }
  async addContent(req: IRequest, res: IResponse) {
    const type = req.body.type
    const data = await this.certificateService.addContent(type, req.body)
    return res.success(data)
  }
}
