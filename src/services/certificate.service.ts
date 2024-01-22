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
import VocabularyModel from '../entities/Vocabulary'
import UserModel from '../entities/User'
import { BadRequestError } from '../middleware/error'
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
        score: item.score,
        totalScore: item.certificate.total_score
      }
    })

    const exploreCertificate = exploreCertificateData.map((item) => {
      return {
        id: item._id,
        name: item.name,
        type: item.type,
        star: 0,
        score: 0,
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
      userId: certificateInfo.user,
      nickName: nickName,
      slug: certificateInfo.slug,
      score: certificateInfo?.score,
      totalScore: certificateInfo?.certificate?.total_score,
      certificateId: certificateInfo.certificate?._id,
      certificateName: certificateInfo.certificate.name,
      archivedDate: certificateInfo.updated,
      star: certificateInfo.star
    }
  }

  async getUserRecordsCertificate(slug: string) {
    const certificateInfo = (await UserCertificateModel.findOne({
      slug: slug
    })
      .populate(['certificate', 'records.vocabulary', 'user'])
      .lean()) as any
    if (!certificateInfo) {
      return null
    }
    return {
      nickName: certificateInfo?.user.nick_name,
      score: certificateInfo?.score,
      totalScore: certificateInfo?.certificate?.total_score,
      certificateName: certificateInfo.certificate.name,
      archivedDate: certificateInfo.updated,
      star: certificateInfo.star,
      records: certificateInfo.records.map((item: any) => {
        return {
          recordId: item._id,
          voiceSrc: item.voice_src,
          result: item.result,
          title: item.vocabulary?.title_display_language,
          phonetic: item.vocabulary?.phonetic_display_language
        }
      })
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
  async getListVocabularyId(vocabularies: string[]) {
    const data = vocabularies.map(async (item: string, index: number) => {
      const voca = (await VocabularyModel.findOne({
        title_display_language: item
      }).lean()) as any

      return {
        order: index + 1,
        vocabularyId: voca?._id
      }
    })

    return await Promise.all(data)
  }
  async getUsersCertificate() {
    const certificates = await UserCertificateModel.find()
      .populate([
        {
          path: 'certificate',
          select: 'name total_score'
        },
        {
          path: 'user',
          select: 'nick_name email avatar'
        }
      ])
      .select('-records')
      .lean()
      .sort('-score updated')
    return certificates.map((item: any, index: number) => {
      return {
        ranking: index + 1,
        nickName: item.user.nick_name,
        avatar: item.user.avatar,
        email: item.user.email,
        certificateName: item.certificate.name,
        slug: `${item.user._id}?id=${item.certificate._id}`,
        percent: (item.score * 100) / item.certificate.total_score,
        score: item.score,
        completedAt: item.updated
      }
    })
  }
}
