import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import LectureService from '../services/lecture.service'
import ChallengeService from '../services/challenge.service'

@injectable()
export default class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}
  async getChallengesInClub(req: IRequest, res: IResponse) {
    const { clubId } = req.params
    const data = await this.challengeService.getChallengesInClub(clubId)
    return res.success(data)
  }
  async getChallengeDetailInClub() {}
  async addRecordChallenge() {}
  async getAllRecordInChallenge() {}
  async updateChallengeMember() {}
  async getRecordToListen() {}
}
