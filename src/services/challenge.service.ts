// @ts-nocheck
import mongoose from 'mongoose'
import { injectable } from 'tsyringe'
import {
  convertToChallengeDisplayDTO,
  convertToDetailChallengeDTO
} from '../coverter/challenge.mapping'
import { convertToUserDTO } from '../coverter/user.mapping'
import {
  convertToRecordOfUser,
  convertToVocabularyDTO,
  convertToVocabularyWithRecordedDTO
} from '../coverter/vocabulary.mapping'
import ChallengeModel from '../entities/Challenge'
import ClubModel from '../entities/Club'
import ClubVocabularyModel from '../entities/ClubVocabulary'
import RecordModel from '../entities/Record'
import { IRecordOfUser, IRecordToListen } from '../interfaces/dto/record.dto'

@injectable()
export default class ChallengeService {
  async getChallengesInClub(clubId: string) {
    const club = await ClubModel.findById(clubId).lean()
    const query = [
      {
        $match: {
          club: new mongoose.Types.ObjectId(clubId)
        }
      },
      {
        $lookup: {
          from: 'club_vocabularies',
          localField: '_id',
          foreignField: 'challenge',
          as: 'vocabularies'
        }
      }
    ]
    const data = await ChallengeModel.aggregate(query)
    return data.map((item) => convertToChallengeDisplayDTO(item, club))
  }
  async getChallengeDetailInClub(challengeId: string) {
    const query = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(challengeId)
        }
      },
      {
        $lookup: {
          from: 'club_vocabularies',
          localField: '_id',
          foreignField: 'challenge',
          as: 'club_vocabularies'
        }
      },
      {
        $lookup: {
          from: 'vocabularies',
          localField: 'club_vocabularies.vocabulary',
          foreignField: '_id',
          as: 'vocabularies'
        }
      }
    ]
    const data = await ChallengeModel.aggregate(query)
    return data.map((item) => convertToDetailChallengeDTO(item)).shift()
  }

  async getAllRecordInChallenge(challengeId: string, userId: string) {
    const challengeInfo = await ChallengeModel.findById(challengeId)
      .populate('participants')
      .lean()
    const records = await RecordModel.find({
      challenge: challengeId,
      user: new mongoose.Types.ObjectId(userId)
    }).populate('vocabulary')
    return {
      challengeName: challengeInfo?.challenge_name,
      clubId: challengeInfo?.club,
      participants: challengeInfo?.participants.map((item: any) =>
        convertToUserDTO(item)
      ),
      challengeId: challengeInfo?._id,
      vocabularies: records.map((item) =>
        convertToVocabularyWithRecordedDTO(item)
      )
    }
  }
  async updateChallengeMember(challengeId: string, me: string) {
    await ChallengeModel.findByIdAndUpdate(
      challengeId,
      { $addToSet: { participants: [me] } },
      { new: true }
    )
    return challengeId
  }
  async getRecordToListenByChallenge(
    challengeId: string,
    me: string
  ): Promise<IRecordToListen> {
    const vocabularies = await ClubVocabularyModel.find({
      challenge: challengeId
    }).populate('vocabulary')

    let participants: IRecordOfUser[] = []

    const challengeById = await ChallengeModel.findById(challengeId).populate(
      'participants'
    )
    if (!challengeById || challengeById.participants.length == 0) {
      participants = []
    } else {
      const userIds = challengeById.participants.map((item: any) =>
        item?._id.toString()
      )

      const participantsVoca = vocabularies.map((voca) => {
        return voca.vocabulary._id.toString()
      })

      const records = await RecordModel.find({
        user: { $in: userIds },
        vocabulary: { $in: participantsVoca },
        challenge: challengeId
      }).populate('user')

      participants = vocabularies.map((voca) => {
        const recordUser = records.filter(
          (item) =>
            item.vocabulary._id.toString() === voca.vocabulary._id.toString()
        )
        return {
          lectureId: voca?.vocabulary?.lecture,
          vCreated: voca?.vocabulary?.created,
          vocabularyId: voca?.vocabulary._id,
          vphoneticDisplayLanguage: voca?.vocabulary?.phonetic_display_language,
          vtitleDisplayLanguage: voca?.vocabulary?.title_display_language,
          vUpdated: voca?.vocabulary?.updated,
          recordUser: recordUser.map((item) => convertToRecordOfUser(item))
        }
      })
    }

    return {
      vocabularies: vocabularies.map((item) =>
        convertToVocabularyDTO(item.vocabulary as any)
      ),
      participants: participants as any
    }
  }
}
