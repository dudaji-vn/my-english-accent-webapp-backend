import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import GoogleService from '../services/google.service'
import { ITextToSpeakDTO } from '../interfaces/dto/google.dto'

@injectable()
export default class GoogleController {
  constructor(private readonly googleService: GoogleService) {}
  async textToSpeak(req: IRequest, res: IResponse) {
    const payload = req.query as unknown as ITextToSpeakDTO
    const data = await this.googleService.textToSpeak(payload)
    return res.success(data)
  }
  async speakToText(req: IRequest, res: IResponse) {
    const data = await this.googleService.speakToText()
    return res.success(data)
  }
}
