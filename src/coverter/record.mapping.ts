import { IRecordByLectureDTO } from '../interfaces/dto/record.dto'

export const convertToRecordsByLectureDTO = (
  item: any
): IRecordByLectureDTO => {
  return {
    imgSrc: item.img_src,
    lectureName: item.lecture_name,
    lectureId: item._id,
    vocabularies: item?.vocabularies
      .filter((item: any) => item.record)
      .map((voca: any) => {
        return {
          vCreated: voca.created,
          vphoneticDisplayLanguage: voca.phonetic_display_language,
          vtitleDisplayLanguage: voca.title_display_language,
          lectureId: voca.lecture,
          vUpdated: voca.updated,
          vocabularyId: voca._id,
          recordId: voca.record._id,
          challengeId: voca.record.challenge,
          rCreated: voca.record.created,
          rUpdated: voca.record.updated,
          userId: voca.record.user,
          voiceSrc: voca.record.voice_src
        }
      })
  }
}
