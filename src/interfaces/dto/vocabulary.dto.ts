export type Language = 'vi' | 'en' | 'kr'

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
}
export interface INativeVocabularyDTO {
  vocabularyId: string
  titleNativeLanguage: string
  language: Language
  nativeVocabulary: string
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
