import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import ScriptService from '../services/script.service'

@injectable()
export default class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}
  async initData(req: IRequest, res: IResponse) {
    const data = await this.scriptService.initData()
    return res.success(data)
  }
}
