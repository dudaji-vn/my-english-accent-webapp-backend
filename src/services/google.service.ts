import { injectable } from 'tsyringe'
import { ITextToSpeakDTO } from '../interfaces/dto/google.dto'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { SpeechClient } from '@google-cloud/speech'
import { BadRequestError } from '../middleware/error.middleware'
@injectable()
export default class GoogleService {
  private textToSpeakClient
  private speakToTextClient
  constructor() {
    this.textToSpeakClient = new TextToSpeechClient({
      keyFile: 'googleKey.json'
    })
    this.speakToTextClient = new SpeechClient({ keyFile: 'googleKey.json' })
  }
  async textToSpeak(payload: ITextToSpeakDTO) {
    const { query, languageCode = 'en-US' } = payload
    if (!query) {
      throw new BadRequestError('Please pass query')
    }

    const [response] = await this.textToSpeakClient.synthesizeSpeech({
      input: { text: query },
      voice: { languageCode: languageCode },
      audioConfig: { audioEncoding: 'MP3' }
    })
    return response
  }
  async speakToText(file: Express.Multer.File) {
    const audio = {
      content: file.buffer.toString('base64')
    }

    const [response] = await this.speakToTextClient.recognize({
      audio: audio,
      config: {
        encoding: 'MP3',
        sampleRateHertz: 16000,
        languageCode: 'en-US'
      }
    })
    return response
  }
}
