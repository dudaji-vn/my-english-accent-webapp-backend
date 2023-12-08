import { STATUS_LECTURE } from '../const/common'
import { ILectureDAO } from '../interfaces/dao/lecture.dao'
import { ILectureDTO } from '../interfaces/dto/lecture.dto'

export const convertToLectureDTO = (lecture: ILectureDAO): ILectureDTO => {
  return {
    lectureId: lecture._id,
    imgSrc: lecture.img_src,
    lectureName: lecture.lecture_name,
    status: lecture.status === STATUS_LECTURE.DRAFT ? 'Draft' : 'Published',
    created: lecture.created,
    updated: lecture.updated,
    published: lecture.published
  }
}
