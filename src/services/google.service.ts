import { injectable } from 'tsyringe'
import { ITextToSpeakDTO } from '../interfaces/dto/google.dto'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { BadRequestError } from '../middleware/error'
@injectable()
export default class GoogleService {
  private client
  constructor() {
    this.client = new TextToSpeechClient({
      keyFile: 'googleKey.json'
    })
  }
  async textToSpeak(payload: ITextToSpeakDTO) {
    const { query, languageCode = 'en-US' } = payload
    if (!query) {
      throw new BadRequestError('Please pass query')
    }

    const [response] = await this.client.synthesizeSpeech({
      input: { text: query },
      voice: { languageCode: languageCode },
      audioConfig: { audioEncoding: 'MP3' }
    })
    return response
  }
  async speakToText() {
    return 'speak to text'
  }
}
