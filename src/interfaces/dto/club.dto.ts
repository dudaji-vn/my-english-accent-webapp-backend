import { EClass } from '../../const/common'

export interface IClubRequest {
  clubId?: string
  clubName?: string
  ownerUser?: string
  lectures?: string[]
  members?: string[]
  class?: EClass[]
}
export interface IClubDTO {
  clubName: string
  description: string
  members: string[]
  ownerUserId: string
  lectures: string[]
  updated: Date
  created: Date
  clubId: string
}
export interface IClubDisplay {
  clubsJoined: IClubDTO[] | any
  clubsOwner: IClubDTO[] | any
}
