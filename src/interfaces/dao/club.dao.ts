import { ILectureDAO } from './lecture.dao'

export interface IClubDAO {
  club_name: string
  description: string
  members: string[]
  owner_user: string
  lectures: ILectureDAO[]
  updated: Date
  created: Date
  _id: string
}
