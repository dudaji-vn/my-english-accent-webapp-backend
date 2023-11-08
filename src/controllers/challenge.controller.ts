import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import LectureService from '../services/lecture.service'
import ChallengeService from '../services/challenge.service'
import { IRecordRequest } from '../interfaces/dto/record.dto'
import { BaseService } from '../services/base.service'
import RecordModel from '../entities/Record'

@injectable()
export default class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}
  async getChallengesInClub(req: IRequest, res: IResponse) {
    const { clubId } = req.params
    const data = await this.challengeService.getChallengesInClub(clubId)
    return res.success(data)
  }
  async getChallengeDetailInClub(req: IRequest, res: IResponse) {
    const { challengeId } = req.params
    const data = await this.challengeService.getChallengeDetailInClub(
      challengeId
    )
    return res.success(data)
  }

  async getAllRecordInChallenge() {}
  async updateChallengeMember(req: IRequest, res: IResponse) {
    const { challengeId } = req.params
    const data = await this.challengeService.updateChallengeMember(
      challengeId,
      req.user._id
    )
    return res.success(data)
  }

  async getRecordByChallenge(req: IRequest, res: IResponse) {
    const { challengeId } = req.params
    const data = await this.challengeService.getRecordByChallenge(
      challengeId,
      req.user._id
    )
    return res.success(data)
  }
}
