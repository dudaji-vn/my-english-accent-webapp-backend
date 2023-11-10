import { injectable } from 'tsyringe'
import LectureModel from '../entities/Lecture'
import { convertToLectureDTO } from '../coverter/lecture.mapping'
import mongoose from 'mongoose'
import ChallengeModel from '../entities/Challenge'
import {
  convertToChallengeDisplayDTO,
  convertToChallengeSummary,
  convertToDetailChallengeDTO
} from '../coverter/challenge.mapping'
import { IRecordRequest } from '../interfaces/dto/record.dto'
import RecordModel from '../entities/Record'
import { BadRequestError } from '../middleware/error'
import ClubVocabularyModel from '../entities/ClubVocabulary'
import {
  convertToVocabularyDTO,
  convertToVocabularyWithNativeDTO
} from '../coverter/vocabulary.mapping'
import { convertToUserDTO } from '../coverter/user.mapping'

@injectable()
export default class ChallengeService {
  async getChallengesInClub(clubId: string) {
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
    return data.map((item) => convertToChallengeDisplayDTO(item))
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
      user: new mongoose.Types.ObjectId('65421becd899b95c139a1df1')
    }).populate('vocabulary')
    return {
      challengeName: challengeInfo?.challenge_name,
      club: challengeInfo?.club,
      participants: challengeInfo?.participants.map((item: any) =>
        convertToUserDTO(item)
      ),
      challengeId: challengeInfo?._id,
      vocabularies: records.map((item) =>
        convertToVocabularyWithNativeDTO(item)
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
  async getRecordByChallenge(challengeId: string, me: string) {
    const vocabularies = await ClubVocabularyModel.find({
      challenge: challengeId
    }).populate('vocabulary')

    //const participants=await
    return {
      vocabularies: vocabularies.map((item) =>
        convertToVocabularyDTO(item.vocabulary as any)
      ),
      participants: []
    }
  }
}
