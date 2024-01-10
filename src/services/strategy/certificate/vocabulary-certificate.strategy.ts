import { CERTIFICATE_TYPE } from '../../../const/common'
import CertificateModel from '../../../entities/certificate.entity'
import { IAddCertificateDTO } from '../../../interfaces/dto/certificate.dto'
import { BadRequestError } from '../../../middleware/error'
import { ICertificateStrategy } from './certificate.strategy'

export class VocabularyCertificateStrategy implements ICertificateStrategy {
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
        vocabulary_id: item.vocabularyId,
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
    return {
      data: args,
      message: 'vocabulary'
    }
  }
  getContent() {
    throw new Error('Method not implemented.')
  }
}
