import {
  INativeVocabularyDAO,
  IVocabularyDAO
} from '../interfaces/dao/vocabulary.dao'
import {
  INativeVocabularyDTO,
  IRecorded,
  IVocabularyDTO
} from '../interfaces/dto/vocabulary.dto'

export function convertToVocabularyDTO(voca: IVocabularyDAO): IVocabularyDTO {
  return {
    vocabularyId: voca._id,
    vCreated: voca.created,
    vUpdated: voca.updated,
    vphoneticDisplayLanguage: voca.phonetic_display_language,
    vtitleDisplayLanguage: voca.title_display_language,
    lectureId: voca.lecture
  }
}

export function convertToVocabularyWithNativeDTO(
  record: any
): IVocabularyDTO & INativeVocabularyDTO & IRecorded {
  return {
    vocabularyId: record.vocabulary._id,
    vCreated: record.vocabulary.created,
    vUpdated: record.vocabulary.updated,
    vphoneticDisplayLanguage: record.vocabulary.phonetic_display_language,
    vtitleDisplayLanguage: record.vocabulary.title_display_language,
    lectureId: record.vocabulary.lecture,
    language: record.native_language,
    nativeVocabulary: record._id,
    titleNativeLanguage: record.title_native_language,
    voiceSrc: record?.voice_src ?? '',
    recordId: record._id
  }
}

export function convertToDetailVocabularyByLecture(item: any) {
  return {
    vocabularyId: item._id,
    numberOrder: item.number_order ?? 0,
    lectureName: item?.lecture?.lecture_name,
    titleDisplay: item.title_display_language,
    phonetic: item.phonetic_display_language
  }
}
