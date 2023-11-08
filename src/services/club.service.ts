import { injectable } from 'tsyringe'
import { IClubDisplay, IClubRequest } from '../interfaces/dto/club.dto'
import ClubModel from '../entities/Club'
import { BadRequestError } from '../middleware/error'
import ChallengeModel from '../entities/Challenge'
import ClubVocabularyModel from '../entities/ClubVocabulary'
import VocabularyModel from '../entities/Vocabulary'
import { convertToGroupDTO } from '../coverter/club.mapping'
import { findRandomIndexWord } from '../common/findRandomIndexWord'

@injectable()
export default class ClubService {
  async addOrUpdateClub(payload: IClubRequest) {
    let clubId
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
      clubId = club._id
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

      vocaList.forEach(async (item: any) => {
        await ClubVocabularyModel.create({
          challenge: challenge._id,
          vocabulary: item._id,
          number: findRandomIndexWord(item.title_display_language)
        })
      })
    } else {
      await ClubModel.findByIdAndUpdate(
        payload.clubId,
        { $addToSet: { members: payload.members } },
        { new: true }
      )
    }
    return clubId || payload.clubId
  }
  async getClubsOwner(me: string): Promise<IClubDisplay> {
    const clubsOwner = await ClubModel.find({
      owner_user: me
    })
      .populate('lectures')
      .sort({ created: -1 })
    const clubJoined = await ClubModel.find({
      members: { $in: [me] }
    })
      .populate('lectures')
      .sort({ created: -1 })
    return {
      clubsJoined: clubJoined.map((item: any) => convertToGroupDTO(item)),
      clubsOwner: clubsOwner.map((item: any) => convertToGroupDTO(item))
    }
  }
}
