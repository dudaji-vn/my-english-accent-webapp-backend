import { injectable } from 'tsyringe'
import {
  IClubDisplay,
  IClubRequest
} from '../interfaces/dto/club.dto'
import ClubModel from '../entities/Club'
import { BadRequestError } from '../middleware/error'
import ChallengeModel from '../entities/Challenge'
import ClubVocabularyModel from '../entities/ClubVocabulary'
import VocabularyModel from '../entities/Vocabulary'
import { convertToGroupDTO } from '../coverter/club.mapping'

@injectable()
export default class ClubService {
  async addOrUpdateClub(payload: IClubRequest) {
    if (!payload.ownerUser) {
      throw new BadRequestError('ownerUserId is required')
    }

    if (!payload.clubId && !payload.members) {
      if (!payload.lectures || payload.lectures.length === 0) {
        throw new BadRequestError('lectures is required')
      }
      if (!payload.clubName) {
        throw new BadRequestError('clubName is required')
      }
      const club = await ClubModel.create({
        club_name: payload.clubName,
        lectures: payload.lectures,
        owner_user: payload.ownerUser
      })
      const challengePayload = {
        club: club._id,
        challenge_name: 'Word-guessing with colleagues'
      }
      const challenge = await ChallengeModel.create(challengePayload)

      const vocaList = await VocabularyModel.where({
        lecture: { $in: payload.lectures }
      })
      if (!vocaList || vocaList.length === 0) {
        throw new BadRequestError('vocalist not found')
      }
      vocaList.forEach((item: any) => {
        ClubVocabularyModel.create({
          challenge: challenge._id,
          vocabulary: item._id,
          number: 2
        })
      })
    } else {
      await ClubModel.findByIdAndUpdate(
        payload.clubId,
        { $set: { members: payload.members } },
        { new: true }
      )
    }
    return true
  }
  async getClubsOwner(me: string): Promise<IClubDisplay> {
    const clubsOwner = await ClubModel.find({
      owner_user: me
    })
    const clubJoined = await ClubModel.find({
      members: { $in: [me] }
    })
    return {
      clubsJoined: clubJoined.map((item: any) =>
        convertToGroupDTO(item)
      ),
      clubsOwner: clubsOwner.map((item: any) =>
        convertToGroupDTO(item)
      )
    }
  }
}
