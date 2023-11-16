export type Language = 'vn' | 'en' | 'kr'

export interface IRecorded {
  voiceSrc: string
  recordId: string
}
export interface IClubVocabularyTypeResponse {
  challengeId: string
  vocabularyId: string
  updated: Date
  created: Date
  number: number
}
export interface IVocabularyDTO {
  vCreated: string
  vphoneticDisplayLanguage: string
  vtitleDisplayLanguage: string
  lectureId: string
  vUpdated: string
  vocabularyId: string
  numberOrder?: number
}

export interface INativeVocabularyDTO {
  vocabularyId: string
  titleNativeLanguage: string
  language: Language
}
export interface IClubVocabularyTypeResponse {
  challengeId: string
  vocabularyId: string
  updated: Date
  created: Date
  number: number
}

export interface IVocabularyRequest {
  numberOrder: string
  lectureId: string
  titleDisplay: string
  phonetic: string
  vocabularyId?: string
  textVN: string
  textKR: string
}
export interface ITextTranslate {
  vn: string
  kr: string
}
