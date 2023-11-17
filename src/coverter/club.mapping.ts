import { IClubDAO } from '../interfaces/dao/club.dao'
import { IClubDTO } from '../interfaces/dto/club.dto'

export const convertToGroupDTO = (club: IClubDAO): IClubDTO => {
  return {
    clubId: club._id,
    clubName: club.club_name,
    description: club.description,
    members: club.members,
    ownerUserId: club.owner_user,
    lectures: club.lectures.map((item) => {
      return {
        lectureName: item.lecture_name,
        imgSrc: item.img_src
      }
    }),
    created: club.created,
    updated: club.updated
  }
}
