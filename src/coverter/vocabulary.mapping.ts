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
    vphoneticDisplayLanguage: voca.title_display_language,
    vtitleDisplayLanguage: voca.phonetic_display_language,
    lectureId: voca.lecture
  }
}

export function convertToVocabularyWithNativeDTO(
  voca: any
): IVocabularyDTO & INativeVocabularyDTO & IRecorded {
  console.log(voca)
  return {
    vocabularyId: voca.vocabulary._id,
    vCreated: voca.vocabulary.created,
    vUpdated: voca.vocabulary.updated,
    vphoneticDisplayLanguage: voca.vocabulary.phonetic_display_language,
    vtitleDisplayLanguage: voca.vocabulary.title_display_language,
    lectureId: voca.vocabulary.lecture,
    language: voca.native_language,
    nativeVocabulary: voca._id,
    titleNativeLanguage: voca.title_native_language,
    voiceSrc: voca?.vocabulary?.voice_src ?? ''
  }
}
