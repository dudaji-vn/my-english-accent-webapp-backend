import { injectable } from 'tsyringe'
import LectureModel from '../entities/Lecture'
import { convertToLectureDTO } from '../coverter/lecture.mapping'
import { ILectureDAO } from '../interfaces/dao/lecture.dao'
import { ILectureDTO } from '../interfaces/dto/lecture.dto'
import { BadRequestError } from '../middleware/error'

@injectable()
export default class LectureService {
  async getAllLectures() {
    const lectures = await LectureModel.find().sort({ created: -1 })
    return lectures.map((item: any) => convertToLectureDTO(item))
  }
  async addOrUpdateLecture(payload: ILectureDTO) {
    if (!payload.lectureName || !payload.imgSrc) {
      throw new BadRequestError('lectureName and imgScr required')
    }
    if (payload.lectureId) {
      await LectureModel.findByIdAndUpdate(
        payload.lectureId,
        {
          lecture_name: payload.lectureName,
          img_src: payload.imgSrc
        },
        {
          upsert: true
        }
      )
    } else {
      const existName = await LectureModel.exists({
        lecture_name: payload.lectureName
      })
      if (existName) {
        throw new BadRequestError('lectureName is exist')
      }
      await LectureModel.create({
        lecture_name: payload.lectureName,
        img_src: payload.imgSrc
      })
    }

    return true
  }
}
