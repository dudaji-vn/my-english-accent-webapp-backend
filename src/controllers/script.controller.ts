import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import FileService from '../services/file.service'

@injectable()
export default class ScriptController {
  constructor(private readonly fileService: FileService) {}
  async importDataFromExcel(req: IRequest, res: IResponse) {
    const data = await this.fileService.importDataFromScript()
    return res.success(data)
  }
}
