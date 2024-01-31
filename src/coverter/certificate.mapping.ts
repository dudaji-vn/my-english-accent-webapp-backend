import { ICertificateDAO } from '../interfaces/dao/certificate.dao'
import { IContentCertificateDTO } from '../interfaces/dto/certificate.dto'

export function convertToCertificateVocabularyContent(
  data: ICertificateDAO,
  nativeLanguage: string
): IContentCertificateDTO {
  return {
    id: data._id,
    archivedImgUrl: data.archived_img_url,
    contents: data.contents.map((item) => ({
      vocabularyId: item.vocabulary._id,
      order: item.order,
      phonetic: item.vocabulary.phonetic_display_language,
      textTranslate:
        nativeLanguage === 'kr'
          ? item.vocabulary.text_translate?.kr
          : item.vocabulary.text_translate?.vn,
      title: item.vocabulary.title_display_language
    })),
    imgUrl: data.img_url,
    name: data.name,
    totalScore: data.total_score
  }
}
