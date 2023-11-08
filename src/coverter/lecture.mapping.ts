import { ILectureDAO } from '../interfaces/dao/lecture.dao'
import { ILectureDTO } from '../interfaces/dto/lecture.dto'

export const convertToLectureDTO = (lecture: ILectureDAO): ILectureDTO => {
  return {
    lectureId: lecture._id,
    imgSrc: lecture.img_src,
    lectureName: lecture.lecture_name
  }
}
