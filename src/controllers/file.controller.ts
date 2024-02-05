import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import { BadRequestError } from '../middleware/error.middleware'
import FileService from '../services/file.service'

@injectable()
export default class FileController {
  constructor(private readonly fileService: FileService) {}
  async uploadLectureAndVocabularyFromCsv(req: IRequest, res: IResponse) {
    if (!req.file) {
      throw new BadRequestError('csvFile is required')
    }
    const data = await this.fileService.uploadLectureAndVocabularyFromCsv(
      req.file
    )

    return res.success(data)
  }
}
