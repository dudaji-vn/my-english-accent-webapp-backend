"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToGroupDTO = void 0;
const convertToGroupDTO = (club) => {
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
            };
        }),
        created: club.created,
        updated: club.updated
    };
};
exports.convertToGroupDTO = convertToGroupDTO;
