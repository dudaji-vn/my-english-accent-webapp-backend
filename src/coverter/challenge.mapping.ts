import { IUserDAO } from '../interfaces/dao/user.dao'
import {
  IChallengeDetailDisplay,
  IChallengeDisplay
} from '../interfaces/dto/challenge.dto'

export function convertToChallengeDisplayDTO(
  item: any,
  club: any
): IChallengeDisplay {
  return {
    challengeId: item._id,
    challengeName: item.challenge_name,
    clubId: item.club,
    clubName: club.club_name,
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
        vocabularyId: voca._id,
        updated: voca.updated,
        created: voca.created,
        number: voca.number,
        vCreated: voca.created,
        vUpdated: voca.updated,
        vphoneticDisplayLanguage: voca.phonetic_display_language,
        vtitleDisplayLanguage: voca.title_display_language,
        lectureId: voca.lecture
      }
    })
  }
}

export function convertToChallengeSummary(item: any): any {
  return {
    challengeId: item._id,
    challengeName: item.challenge_name,
    clubId: item.club,
    created: item.created,
    updated: item.updated,
    participants: item.challenge?.participants.map((user: IUserDAO) => {
      return {
        avatarUrl: user.avatar_url,
        userId: user._id,
        displayLanguage: user.display_language,
        nickName: user.nick_name,
        nativeLanguage: user.native_language
      }
    }),
    vocabularies: item.vocabulary.map((voca: any) => {
      return {
        record: voca.record,
        challengeId: voca.challenge,
        vocabularyId: voca._id,
        number: voca.number,
        vphoneticDisplayLanguage: voca.phonetic_display_language,
        vtitleDisplayLanguage: voca.title_display_language,
        lectureId: voca.lecture
      }
    })
  }
}
