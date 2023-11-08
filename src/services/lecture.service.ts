import { injectable } from 'tsyringe'
import LectureModel from '../entities/Lecture'
import { convertToLectureDTO } from '../coverter/lecture.mapping'

@injectable()
export default class LectureService {
  async getAllLectures() {
    const lectures = await LectureModel.find()
    return lectures.map((item: any) => convertToLectureDTO(item))
  }
}
