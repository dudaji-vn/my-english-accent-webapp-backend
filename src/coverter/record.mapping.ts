import { IRecordByLectureDTO } from '../interfaces/dto/record.dto'

export const convertToRecordsByLectureDTO = (
  item: any
): IRecordByLectureDTO => {
  return {
    imgSrc: item.img_src,
    lectureName: item.lecture_name,
    lectureId: item._id,
    vocabularies: item?.vocabularies.map((voca: any) => {
      return {
        vCreated: voca.created,
        vphoneticDisplayLanguage: voca.phonetic_display_language,
        vtitleDisplayLanguage: voca.title_display_language,
        lectureId: voca.lecture,
        vUpdated: voca.updated,
        vocabularyId: voca._id,
        recordId: voca.record._id,
        challengeId: voca.record.challenge, // Example of a null value
        rCreated: voca.record.created,
        rUpdated: voca.record.updated,
        userId: voca.record.user,
        rVoiceSrc: voca.record.voice_src
      }
    })
  }
}
