import { CERTIFICATE_TYPE } from '../../../const/common'
import { convertToCertificateVocabularyContent } from '../../../coverter/certificate.mapping'
import CertificateModel from '../../../entities/certificate.entity'
import UserCertificateModel from '../../../entities/user-certificate.entity'
import {
  IAddCertificateDTO,
  IGetContentDTO,
  IUserCertificateDTO
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
  async addOrUpdateUserContentCertificate(data: IUserCertificateDTO) {
    const {
      certificateId,
      records,
      score,
      star,
      userId,
      nickName,
      correctSentences
    } = data
    if (
      !certificateId ||
      !records ||
      score < 1 ||
      star < 1 ||
      !userId ||
      !nickName
    ) {
      throw new BadRequestError('Please input valid data')
    }
    records.forEach((record) => {
      if (!record.result || !record.vocabularyId || !record.voiceSrc) {
        throw new BadRequestError('Please input valid record data')
      }
    })
    const certificate = await CertificateModel.findById(certificateId).lean()
    if (
      !certificate ||
      !certificate.contents ||
      certificate.contents.length === 0
    ) {
      throw new BadRequestError('Certificate has not exist')
    }
    const vocabularyIds = certificate.contents.map((item) =>
      item.vocabulary.toString()
    )
    const recordVocabularyIds = records.map((item) => item.vocabularyId)

    if (
      records.length !== vocabularyIds.length ||
      new Set(vocabularyIds).size !== new Set(recordVocabularyIds).size
    ) {
      throw new BadRequestError('Records is different')
    }
    records.map((record) => {
      if (!vocabularyIds.includes(record.vocabularyId)) {
        throw new BadRequestError('some vocabulary is not correct')
      }
    })
    await UserCertificateModel.findOneAndUpdate(
      {
        certificate: certificateId,
        user: userId
      },
      {
        score: score,
        star: star,
        correct_sentences: correctSentences,
        records: records.map((item) => ({
          vocabulary: item.vocabularyId,
          voice_src: item.voiceSrc,
          result: item.result
        }))
      },
      {
        upsert: true,
        new: true
      }
    )
    return {
      nickName: nickName,
      score: score,
      star: star
    }
  }
}
