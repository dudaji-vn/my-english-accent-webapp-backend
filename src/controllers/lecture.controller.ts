import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import {
  IChangeStatusLectureRequest,
  IFormLectureAndVocabularyRequest
} from '../interfaces/dto/lecture.dto'
import LectureService from '../services/lecture.service'

@injectable()
export default class LectureController {
  constructor(private readonly lectureService: LectureService) {}
  async getAllLectures(req: IRequest, res: IResponse) {
    const data = await this.lectureService.getAllLectures()
    return res.success(data)
  }
  async getAllLecturesForAdmin(req: IRequest, res: IResponse) {
    const data = await this.lectureService.getAllLecturesForAdmin()
    return res.success(data)
  }
  async addLectureAndVocabulary(req: IRequest, res: IResponse) {
    const payload = req.body as IFormLectureAndVocabularyRequest
    const data = await this.lectureService.addLectureAndVocabulary(payload)
    return res.success(data)
  }
  async changeStatusLecture(req: IRequest, res: IResponse) {
    const payload = req.body as IChangeStatusLectureRequest
    const data = await this.lectureService.changeStatusLecture(payload)
    return res.success(data)
  }
}
