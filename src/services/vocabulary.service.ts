import mongoose from 'mongoose'
import { injectable } from 'tsyringe'
import { StageExercise } from '../const/common'
import {
  convertToDetailVocabularyByLecture,
  convertToVocabularyWithRecordedDTO,
  convertToVocabularyWithTranslateDTO
} from '../coverter/vocabulary.mapping'
import EnrollmentModel from '../entities/Enrollment'

import VocabularyModel from '../entities/Vocabulary'
import { IVocaByLectureRequest } from '../interfaces/dto/record.dto'
import {
  ITextTranslate,
  IVocabularyRequest,
  Language
} from '../interfaces/dto/vocabulary.dto'
import { BadRequestError } from '../middleware/error'

@injectable()
export default class VocabularyService {
  async getVocabularyById(vocabularyId: string, nativeLanguage: Language) {
    const vocabulary = await VocabularyModel.findById(vocabularyId).lean()
    return convertToVocabularyWithTranslateDTO(
      vocabulary as any,
      nativeLanguage
    )
  }
  async getAllVocabulariesByLectures(payload: IVocaByLectureRequest) {
    const { lectureId, userId, nativeLanguage } = payload
    const aggQuery = [
      {
        $match: {
          lecture: new mongoose.Types.ObjectId(lectureId)
        }
      },
      {
        $lookup: {
          from: 'records',
          localField: '_id',
          foreignField: 'vocabulary',
          as: 'records'
        }
      },
      {
        $addFields: {
          record: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$records',
                  as: 'record',
                  cond: {
                    $and: [
                      {
                        $eq: [
                          '$$record.user',
                          new mongoose.Types.ObjectId(payload.userId)
                        ]
                      },
                      {
                        $eq: ['$$record.challenge', null]
                      }
                    ]
                  }
                }
              },
              0
            ]
          }
        }
      },

      {
        $project: {
          'vocabulary._id': '$_id',
          'vocabulary.created': '$created',
          'vocabulary.updated': '$updated',
          'vocabulary.title_display_language': '$title_display_language',
          'vocabulary.text_translate': '$text_translate',
          'vocabulary.phonetic_display_language': '$phonetic_display_language',
          'vocabulary.lecture': '$lecture',
          'vocabulary.voice_src': '$record.voice_src',
          'vocabulary.record_id': '$record._id'
        }
      },
      {
        $sort: {
          'vocabulary.voice_src': -1
        }
      }
    ]

    const currentEnrollMent = await EnrollmentModel.findOne({
      user: userId,
      lecture: lectureId
    })
    const vocabularies = await VocabularyModel.aggregate(aggQuery as any)

    return {
      currentStep: currentEnrollMent?.current_step ?? 0,
      enrollmentId: currentEnrollMent?._id ?? null,
      lectureId: lectureId,
      stage: currentEnrollMent?.stage ?? StageExercise.Open,
      vocabularies: vocabularies.map((item: any) =>
        convertToVocabularyWithRecordedDTO(item, nativeLanguage)
      )
    }
  }

  async getVocabularyByLectureId(lectureId: string) {
    let listVoca: any = []
    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return []
    } else {
      listVoca = await VocabularyModel.find({
        lecture: lectureId
      })
        .lean()
        .sort({
          lecture: 1,
          number_order: 1
        })
        .populate('lecture')
    }

    const data = listVoca.map((voca: any) => {
      return convertToDetailVocabularyByLecture(voca)
    })

    return data
  }

  async addOrUpdateVocabulary(payload: IVocabularyRequest) {
    const {
      lectureId,
      phonetic,
      titleDisplay,
      textKR,
      textVN,
      vocabularyId,
      numberOrder
    } = payload
    if (
      !lectureId ||
      !phonetic ||
      !titleDisplay ||
      !textKR ||
      !textVN ||
      parseInt(numberOrder) < 0
    ) {
      throw new BadRequestError('missing fields')
    }
    const textTranslate: ITextTranslate = {
      vn: textVN,
      kr: textKR
    }
    if (vocabularyId) {
      await VocabularyModel.findByIdAndUpdate(payload.vocabularyId, {
        number_order: numberOrder,
        title_display_language: titleDisplay,
        lecture: lectureId,
        phonetic_display_language: phonetic,
        text_translate: textTranslate
      })
    } else {
      const existName = await VocabularyModel.exists({
        title_display_language: titleDisplay,
        lecture: new mongoose.Types.ObjectId(lectureId)
      })
      if (existName) {
        throw new BadRequestError('vocabulary is exist in lecture')
      }
      await VocabularyModel.create({
        number_order: numberOrder,
        title_display_language: titleDisplay,
        lecture: lectureId,
        phonetic_display_language: phonetic,
        text_translate: textTranslate
      })
    }

    return true
  }
}
