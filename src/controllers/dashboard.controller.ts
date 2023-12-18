import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import DashboardService from '../services/dashboard.service'

@injectable()
export default class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  async getAnalyst(req: IRequest, res: IResponse) {
    const data = await this.dashboardService.getAnalyst()

    return res.success(data)
  }
  async getTopUserCompleteLecture(req: IRequest, res: IResponse) {
    const { country, numberLecture } = req.query as any
    console.log(country)
    const data = await this.dashboardService.getTopUserCompleteLecture(
      country as string,
      parseInt(numberLecture)
    )

    return res.success(data)
  }
  async getTop5Lectures(req: IRequest, res: IResponse) {
    const data = await this.dashboardService.getTop5Lectures()

    return res.success(data)
  }

  async syncData(req: IRequest, res: IResponse) {
    const data = await this.dashboardService.syncData()
    return res.success(data)
  }
}
