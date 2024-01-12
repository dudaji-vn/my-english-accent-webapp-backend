import { injectable } from 'tsyringe'
import CertificateModel from '../entities/certificate.entity'
import {
  CertificateStrategy,
  TNameCertificateStrategy
} from './strategy/certificate/certificate.strategy'
import { VocabularyCertificateStrategy } from './strategy/certificate/vocabulary-certificate.strategy'
import {
  IAddCertificateDTO,
  IGetContentDTO,
  IUserCertificateDTO
} from '../interfaces/dto/certificate.dto'
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
    const archivedCertificateData = await UserCertificateModel.find({
      user: userId
    })
      .populate('certificate')
      .lean()

    const exploreCertificateData = await CertificateModel.find({
      _id: {
        $nin: archivedCertificateData.map((item) => item.certificate)
      }
    })
    let archivedCertificate = archivedCertificateData.map((item: any) => {
      return {
        id: item.certificate._id,
        name: item.certificate.name,
        type: item.certificate.type,
        star: item.star,
        totalScore: item.certificate.total_score
      }
    })

    const exploreCertificate = exploreCertificateData.map((item) => {
      return {
        id: item._id,
        name: item.name,
        type: item.type,
        star: 0,
        totalScore: item.total_score
      }
    })
    return [...archivedCertificate, ...exploreCertificate]
  }

  async isArchived(userId: string, certificateId: string) {
    return await UserCertificateModel.exists({
      user_id: userId,
      certificate_id: certificateId
    })
  }

  async getUserCertificate(
    nickName: string,
    userId: string,
    certificateId: string
  ) {
    const certificateInfo = (await UserCertificateModel.findOne({
      user: userId,
      certificate: certificateId
    })
      .populate('certificate')
      .lean()) as any
    if (!certificateInfo) {
      return null
    }
    return {
      nickName: nickName,
      score: certificateInfo?.score,
      totalScore: certificateInfo?.certificate?.total_score,
      certificateName: certificateInfo.certificate.name,
      archivedDate: certificateInfo.updated,
      star: certificateInfo.star
    }
  }

  async getContentById(name: TNameCertificateStrategy, params: IGetContentDTO) {
    return this.certificateStrategy.getContentById(name, params)
  }
  addOrUpdateUserContentCertificate<T>(
    name: TNameCertificateStrategy,
    data: IUserCertificateDTO
  ) {
    return this.certificateStrategy.addOrUpdateUserContentCertificate(
      name,
      data
    )
  }
  addCertificate(name: TNameCertificateStrategy, data: IAddCertificateDTO) {
    return this.certificateStrategy.addCertificate(name, data)
  }
}
