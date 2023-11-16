import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import LectureService from '../services/lecture.service'
import { ILectureDTO } from '../interfaces/dto/lecture.dto'

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
  async addOrUpdateLecture(req: IRequest, res: IResponse) {
    const payload = req.body as ILectureDTO
    const data = await this.lectureService.addOrUpdateLecture(payload)
    return res.success(data)
  }
}
