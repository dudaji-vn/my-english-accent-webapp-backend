import { ITextTranslate, Language } from '../dto/vocabulary.dto'

export interface IVocabularyDAO {
  _id: string
  title_display_language: string
  phonetic_display_language: string
  number_order?: number
  text_translate: ITextTranslate
  lecture: string
  updated: string
  created: string
}
export interface INativeVocabularyDAO {
  native_language: string
  title_native_language: string
  language: Language
}
