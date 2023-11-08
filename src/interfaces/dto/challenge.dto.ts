import { IClubVocabularyTypeResponse, IVocabularyDTO } from './vocabulary.dto'
export interface IChallengeResponseType {
  challengeName: string
  clubId: string
  participants: string[]
  updated: Date
  created: Date
  challengeId: string
}
export interface IChallengeDisplay {
  challengeName: string
  clubId: string
  participants: string[]
  updated: Date
  created: Date
  challengeId: string
  vocabularies: IClubVocabularyTypeResponse[]
}

export interface IChallengeDetailDisplay extends IChallengeResponseType {
  vocabularies: IVocabularyDTO[] & IClubVocabularyTypeResponse[]
}
