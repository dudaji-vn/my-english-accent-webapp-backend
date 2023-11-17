import { ILectureDTO } from './lecture.dto'

export interface IClubRequest {
  clubId?: string
  clubName?: string
  ownerUser?: string
  lectures?: string[]
  members?: string[]
}
export interface IClubDTO {
  clubName: string
  description: string
  members: string[]
  ownerUserId: string
  lectures: ILectureDTO[]
  updated: Date
  created: Date
  clubId: string
}
export interface IClubDisplay {
  clubsJoined: IClubDTO[] | any
  clubsOwner: IClubDTO[] | any
}
