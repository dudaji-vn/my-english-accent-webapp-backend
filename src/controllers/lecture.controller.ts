import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import LectureService from '../services/lecture.service'

@injectable()
export default class LectureController {
  constructor(private readonly lectureService: LectureService) {}
  async getAllLectures(req: IRequest, res: IResponse) {
    const data = await this.lectureService.getAllLectures()
    return res.success(data)
  }
}
