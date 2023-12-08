import { injectable } from 'tsyringe'
import LectureModel from '../entities/Lecture'
import { convertToLectureDTO } from '../coverter/lecture.mapping'
import { ILectureDAO } from '../interfaces/dao/lecture.dao'
import {
  IChangeStatusLectureRequest,
  IFormLectureAndVocabularyRequest,
  ILectureDTO
} from '../interfaces/dto/lecture.dto'
import { BadRequestError } from '../middleware/error'
import VocabularyModel from '../entities/Vocabulary'
import { STATUS_LECTURE } from '../const/common'

@injectable()
export default class LectureService {
  async getAllLectures() {
    const vocabularies = await VocabularyModel.find().lean()
    const listLectureIds = vocabularies.map((item: any) =>
      item.lecture.toString()
    )
    const distinctLectureIds = [...new Set(listLectureIds)]
    const lectures = await LectureModel.find({
      _id: { $in: distinctLectureIds }
    }).sort({ created: -1 })

    return lectures.map((item: any) => convertToLectureDTO(item))
  }
  async getAllLecturesForAdmin() {
    const lectures = await LectureModel.find().sort({ created: -1 })
    return lectures.map((item: any) => convertToLectureDTO(item))
  }
  async addLectureAndVocabulary(payload: IFormLectureAndVocabularyRequest) {
    const { lectureId, lectureName, imgSrc, status, listVocabulary } = payload

    if (!lectureName) {
      throw new BadRequestError('Missing Lecture name')
    }
    if (!imgSrc) {
      throw new BadRequestError('Please select image')
    }
    if (!status) {
      throw new BadRequestError('Missing status')
    }
    if (!listVocabulary) {
      throw new BadRequestError('Please input list vocabularies')
    }
    const isValidVocabularies = listVocabulary.every((item) => {
      return (
        item.numberOrder &&
        item.phonetic &&
        item.textKR &&
        item.textVN &&
        item.titleDisplay
      )
    })
    if (!isValidVocabularies) {
      throw new BadRequestError('Missing data from vocabularies')
    }
    if (lectureId) {
      const lecture = await LectureModel.findById(lectureId)

      if (!lecture) {
        throw new BadRequestError('Not found lecture')
      }
      if (lecture.status !== STATUS_LECTURE.DRAFT) {
        throw new BadRequestError('Only edit lecture draft')
      }
      await LectureModel.findByIdAndUpdate(lectureId, {
        lecture_name: lectureName,
        img_src: imgSrc,
        status:
          status === 'Published' ? STATUS_LECTURE.PUBLIC : STATUS_LECTURE.DRAFT,
        published: status === 'Published' ? new Date() : null
      })
      await VocabularyModel.deleteMany({
        lecture: lecture._id
      })
      for (const voca of listVocabulary) {
        await VocabularyModel.findOneAndUpdate(
          {
            number_order: voca.numberOrder,
            lecture: lectureId
          },
          {
            title_display_language: voca.titleDisplay,
            phonetic_display_language: voca.phonetic,
            text_translate: {
              vn: voca.textVN,
              kr: voca.textKR
            }
          },
          { upsert: true }
        )
      }
    } else {
      const lectureDb = await LectureModel.findOne({
        lecture_name: lectureName
      })
      if (lectureDb) {
        throw new BadRequestError('Lecture name is duplicated')
      }
      const lecture = await LectureModel.create({
        lecture_name: lectureName,
        img_src: imgSrc,
        status:
          status === 'Published' ? STATUS_LECTURE.PUBLIC : STATUS_LECTURE.DRAFT,
        published: status === 'Published' ? new Date() : null
      })
      const needSaveListVocabularies = listVocabulary.map((item) => {
        return {
          number_order: item.numberOrder,
          title_display_language: item.titleDisplay,
          lecture: lecture._id,
          phonetic_display_language: item.phonetic,
          text_translate: {
            vn: item.textVN,
            kr: item.textKR
          }
        }
      })
      await VocabularyModel.insertMany(needSaveListVocabularies)
    }

    return true
  }
  async changeStatusLecture(payload: IChangeStatusLectureRequest) {
    const { lectureId, status } = payload
    const lecture = await LectureModel.findById(lectureId)
    if (!lecture) {
      throw new BadRequestError('cannot find lecture')
    }
    lecture.status =
      status === 'Draft' ? STATUS_LECTURE.DRAFT : STATUS_LECTURE.PUBLIC
    lecture.published = status === 'Published' ? new Date() : (null as any)
    lecture.save()
    return true
  }
}
