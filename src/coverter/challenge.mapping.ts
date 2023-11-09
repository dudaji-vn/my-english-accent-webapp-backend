import {
  IChallengeDetailDisplay,
  IChallengeDisplay
} from '../interfaces/dto/challenge.dto'

export function convertToChallengeDisplayDTO(item: any): IChallengeDisplay {
  return {
    challengeId: item._id,
    challengeName: item.challenge_name,
    clubId: item.club,
    created: item.created,
    participants: item.participants,
    updated: item.updated,
    vocabularies: item.vocabularies.map((voca: any) => {
      return {
        challengeId: voca.challenge,
        vocabularyId: voca._id,
        updated: voca.updated,
        created: voca.created,
        number: voca.number
      }
    })
  }
}

export function convertToDetailChallengeDTO(
  item: any
): IChallengeDetailDisplay {
  return {
    challengeId: item._id,
    challengeName: item.challenge_name,
    clubId: item.club,
    created: item.created,
    participants: item.participants,
    updated: item.updated,
    vocabularies: item.vocabularies.map((voca: any) => {
      return {
        challengeId: voca.challenge,
        vocabularyId: voca.vocabulary,
        updated: voca.updated,
        created: voca.created,
        number: voca.number,
        clubVocabularyId: voca._id,
        vCreated: voca.created,
        vUpdated: voca.updated,
        vphoneticDisplayLanguage: voca.title_display_language,
        vtitleDisplayLanguage: voca.phonetic_display_language,
        lectureId: voca.lecture
      }
    })
  }
}
