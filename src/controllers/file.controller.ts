import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import FileService from '../services/file.service'

@injectable()
export default class FileController {
  constructor(private readonly fileService: FileService) {}
  async syncDataFromExcel(req: IRequest, res: IResponse) {
    const data = await this.fileService.syncDataFromExcel()
    return res.success(data)
  }
}
