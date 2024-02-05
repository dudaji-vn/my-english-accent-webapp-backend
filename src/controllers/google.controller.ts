import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import GoogleService from '../services/google.service'
import { ITextToSpeakDTO } from '../interfaces/dto/google.dto'
import { BadRequestError } from '../middleware/error.middleware'

@injectable()
export default class GoogleController {
  constructor(private readonly googleService: GoogleService) {}
  async textToSpeak(req: IRequest, res: IResponse) {
    const payload = req.query as unknown as ITextToSpeakDTO
    const data = await this.googleService.textToSpeak(payload)
    return res.success(data)
  }
  async speakToText(req: IRequest, res: IResponse) {
    if (!req.file) {
      throw new BadRequestError('You missing file')
    }
    const data = await this.googleService.speakToText(req.file)
    return res.success(data)
  }
}
