import { CERTIFICATE_TYPE } from '../../../const/common'
import { convertToCertificateVocabularyContent } from '../../../coverter/certificate.mapping'
import CertificateModel from '../../../entities/certificate.entity'
import { ICertificateDAO } from '../../../interfaces/dao/certificate.dao'
import {
  IAddCertificateDTO,
  IGetContentDTO
} from '../../../interfaces/dto/certificate.dto'
import { BadRequestError } from '../../../middleware/error'
import { ICertificateStrategy } from './certificate.strategy'

export class VocabularyCertificateStrategy implements ICertificateStrategy {
  async getContentById(params: IGetContentDTO) {
    const result = await CertificateModel.findById(params.certificateId)
      .populate('contents.vocabulary')
      .lean()
    if (!result) {
      throw new BadRequestError('Not found content')
    }

    return convertToCertificateVocabularyContent(
      result as any,
      params.nativeLanguage
    )
  }
  async addCertificate(certificate: IAddCertificateDTO) {
    const { name, contents, imgUrl, totalScore, archivedImgUrl } = certificate
    const isExist = await CertificateModel.exists({ name: name })
    if (isExist) {
      throw new BadRequestError('certificate name is exist')
    }
    if (!contents) {
      throw new BadRequestError('contents is required')
    }
    const filterContents = contents
      .filter((item) => item.order && item.vocabularyId)
      .map((item) => ({
        vocabulary: item.vocabularyId,
        order: item.order
      }))
    const newCertificate = await CertificateModel.create({
      name: name,
      contents: filterContents,
      img_url: imgUrl,
      archived_img_url: archivedImgUrl,
      total_score: totalScore,
      type: CERTIFICATE_TYPE.VOCABULARY
    })

    return newCertificate
  }
  addContent(args: any[]) {
    throw new Error('Method not implemented.')
  }
}
