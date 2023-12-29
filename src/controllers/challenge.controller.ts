import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import ChallengeService from '../services/challenge.service'

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

  async getAllRecordInChallenge(req: IRequest, res: IResponse) {
    const { challengeId } = req.params
    const data = await this.challengeService.getAllRecordInChallenge(
      challengeId,
      req.user._id
    )
    return res.success(data)
  }
  async updateChallengeMember(req: IRequest, res: IResponse) {
    const { challengeId } = req.params
    const data = await this.challengeService.updateChallengeMember(
      challengeId,
      req.user._id
    )
    return res.success(data)
  }

  async getRecordToListenByChallenge(req: IRequest, res: IResponse) {
    const { challengeId } = req.params
    const data = await this.challengeService.getRecordToListenByChallenge(
      challengeId,
      req.user._id
    )
    return res.success(data)
  }
}
