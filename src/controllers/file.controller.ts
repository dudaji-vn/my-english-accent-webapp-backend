import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import FileService from '../services/file.service'

@injectable()
export default class FileController {
  constructor(private readonly fileService: FileService) {}
}
