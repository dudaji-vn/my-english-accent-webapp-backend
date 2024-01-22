import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import CertificateService from '../services/certificate.service'
import {
  IAddCertificateDTO,
  IUserCertificateDTO
} from '../interfaces/dto/certificate.dto'
import { TNameCertificateStrategy } from '../services/strategy/certificate/certificate.strategy'

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
  async addOrUpdateUserContentCertificate(req: IRequest, res: IResponse) {
    const payload = req.body as IUserCertificateDTO
    const strategyType = payload.strategyType
    payload.nickName = req.user.nick_name
    payload.userId = req.user._id
    const data =
      await this.certificateService.addOrUpdateUserContentCertificate(
        strategyType,
        payload
      )
    return res.success(data)
  }
  async getContentById(req: IRequest, res: IResponse) {
    const { strategyType, id } = req.query
    const data = await this.certificateService.getContentById(
      strategyType as TNameCertificateStrategy,
      {
        certificateId: id as string,
        nativeLanguage: req.user.native_language
      }
    )
    return res.success(data)
  }
  async isArchived(req: IRequest, res: IResponse) {
    const { id } = req.query
    const data = await this.certificateService.isArchived(
      req.user._id,
      id as string
    )
    return res.success(data)
  }
  async getUserCertificate(req: IRequest, res: IResponse) {
    const { certificateId } = req.query
    const data = await this.certificateService.getUserCertificate(
      req.user.nick_name,
      req.user._id,
      certificateId as string
    )
    return res.success(data)
  }
  async getUserRecordsCertificate(req: IRequest, res: IResponse) {
    const { slug } = req.query
    const data = await this.certificateService.getUserRecordsCertificate(
      slug as string
    )
    return res.success(data)
  }
  async getListVocabularyId(req: IRequest, res: IResponse) {
    const { vocabularies } = req.body
    const data = await this.certificateService.getListVocabularyId(vocabularies)
    return res.success(await Promise.all(data))
  }
  async getUsersCertificate(req: IRequest, res: IResponse) {
    const data = await this.certificateService.getUsersCertificate()
    return res.success(data)
  }
}
