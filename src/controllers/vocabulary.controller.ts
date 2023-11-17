import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import { IVocabularyRequest, Language } from '../interfaces/dto/vocabulary.dto'
import VocabularyService from '../services/vocabulary.service'

@injectable()
export default class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}
  async getVocabularyById(req: IRequest, res: IResponse) {
    const { vocabularyId } = req.params
    const nativeLanguage = req.user.native_language
    const data = await this.vocabularyService.getVocabularyById(
      vocabularyId,
      nativeLanguage
    )
    return res.success(data)
  }
  async getAllVocabulariesByLectures(req: IRequest, res: IResponse) {
    const { lectureId } = req.query
    const data = await this.vocabularyService.getAllVocabulariesByLectures({
      lectureId: lectureId as any,
      userId: req.user._id,
      nativeLanguage: req.user.native_language as Language
    })
    return res.success(data)
  }
  async getAllVocabularyByLectureId(req: IRequest, res: IResponse) {
    const { lectureId } = req.query
    const data = await this.vocabularyService.getVocabularyByLectureId(
      lectureId as string
    )
    return res.success(data)
  }

  async addOrUpdateVocabulary(req: IRequest, res: IResponse) {
    const payload = req.body as IVocabularyRequest
    const data = await this.vocabularyService.addOrUpdateVocabulary(payload)
    return res.success(data)
  }
}
