import { EClass } from '../../const/common'

export interface ILectureDAO {
  _id?: string
  lecture_name: string
  img_src: string
  class: EClass
}
