import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import ScriptService from '../services/script.service'
import ClubService from '../services/club.service'
import { IClubRequest } from '../interfaces/dto/club.dto'

@injectable()
export default class ClubController {
  constructor(private readonly clubService: ClubService) {}
  async addOrUpdateClub(req: IRequest, res: IResponse) {
    const payload = req.body as IClubRequest
    payload.class = req.user?.class
    payload.ownerUser = req.user._id
    const data = await this.clubService.addOrUpdateClub(payload)
    return res.success(data)
  }

  async getClubsOwner(req: IRequest, res: IResponse) {
    const result = await this.clubService.getClubsOwner(req.user._id)
    return res.success(result)
  }
  async getMembersInfo(req: IRequest, res: IResponse) {
    const { clubId } = req.params
    const data = await this.clubService.getMembersInfo(clubId)
    return res.success(data)
  }
}
