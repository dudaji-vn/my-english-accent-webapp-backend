import { injectable } from 'tsyringe'
import NativeTranslationModel from '../entities/NativeTranslation'
import {
  convertToDetailVocabularyByLecture,
  convertToVocabularyDTO,
  convertToVocabularyWithNativeDTO
} from '../coverter/vocabulary.mapping'
import { IVocaByLectureRequest } from '../interfaces/dto/record.dto'
import { Language, StageExercise } from '../const/common'
import EnrollmentModel from '../entities/Enrollment'
import VocabularyModel from '../entities/Vocabulary'
import mongoose from 'mongoose'
import { ILectureDTO } from '../interfaces/dto/lecture.dto'
import { IVocabularyRequest } from '../interfaces/dto/vocabulary.dto'
import { BadRequestError } from '../middleware/error'

@injectable()
export default class VocabularyService {
  async getVocabularyById(vocabularyId: string, nativeLanguage: string) {
    const vocabulary = await NativeTranslationModel.findOne({
      vocabulary: vocabularyId,
      native_language: nativeLanguage
    }).populate('vocabulary')
    return convertToVocabularyWithNativeDTO(vocabulary)
  }
  async getAllVocabulariesByLectures(payload: IVocaByLectureRequest) {
    const { lectureId, userId } = payload
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
                    $eq: [
                      '$$record.user',
                      new mongoose.Types.ObjectId(payload.userId)
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
        $lookup: {
          from: 'native_translations',
          localField: '_id',
          foreignField: 'vocabulary',
          as: 'voca_native'
        }
      },
      {
        $addFields: {
          voca_native: {
            $arrayElemAt: ['$voca_native', 0]
          }
        }
      },

      {
        $project: {
          'vocabulary._id': '$_id',
          'vocabulary.created': '$created',
          'vocabulary.updated': '$updated',
          'vocabulary.title_display_language': '$title_display_language',
          'vocabulary.phonetic_display_language': '$phonetic_display_language',
          'vocabulary.lecture': '$lecture',
          'vocabulary.voice_src': '$record.voice_src',
          _id: '$voca_native._id',
          title_native_language: '$voca_native.title_native_language',
          native_language: '$voca_native.native_language'
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
        convertToVocabularyWithNativeDTO(item)
      )
    }
  }

  async getVocabularyByLectureId(lectureId: string) {
    let listVoca: any = []
    if (!lectureId) {
      listVoca = await VocabularyModel.find()
        .lean()
        .sort({
          lecture: 1, // Sort by lecture in ascending order
          number_order: 1 // Sort by number_order in ascending order
        })
        .populate('lecture')
    } else {
      listVoca = await VocabularyModel.find({
        lecture: lectureId
      })
        .lean()
        .sort({
          lecture: 1, // Sort by lecture in ascending order

          number_order: 1 // Sort by number_order in ascending order
        })
        .populate('lecture')
    }

    const listVocaPromise = listVoca.map(async (item: any) => {
      const [textVn, textKorean] = await Promise.all([
        NativeTranslationModel.findOne({
          vocabulary: item._id,
          native_language: Language.Vn
        }).lean(),
        NativeTranslationModel.findOne({
          vocabulary: item._id,
          native_language: Language.Kr
        }).lean()
      ])

      return {
        textVN: textVn?.title_native_language ?? '',
        textKR: textKorean?.title_native_language ?? '',
        ...convertToDetailVocabularyByLecture(item)
      }
    })

    return await Promise.all(listVocaPromise)
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
    if (vocabularyId) {
      await VocabularyModel.findByIdAndUpdate(payload.vocabularyId, {
        number_order: numberOrder,
        title_display_language: titleDisplay,
        lecture: lectureId,
        phonetic_display_language: phonetic
      })
      await NativeTranslationModel.findOneAndUpdate(
        {
          vocabulary: vocabularyId,
          native_language: Language.Kr
        },
        {
          title_native_language: textKR
        },
        {
          upsert: true
        }
      )
      await NativeTranslationModel.findOneAndUpdate(
        {
          vocabulary: vocabularyId,
          native_language: Language.Vn
        },
        {
          title_native_language: textVN
        },
        {
          upsert: true
        }
      )
    } else {
      const existName = await VocabularyModel.exists({
        title_display_language: titleDisplay
      })
      if (existName) {
        throw new BadRequestError('vocabulary is exist')
      }
      let newVoca = await VocabularyModel.create({
        number_order: numberOrder,
        title_display_language: titleDisplay,
        lecture: lectureId,
        phonetic_display_language: phonetic
      })
      await NativeTranslationModel.findOneAndUpdate(
        {
          vocabulary: newVoca._id,
          native_language: Language.Kr
        },
        {
          title_native_language: textKR
        },
        {
          upsert: true
        }
      )
      await NativeTranslationModel.findOneAndUpdate(
        {
          vocabulary: newVoca._id,
          native_language: Language.Vn
        },
        {
          title_native_language: textVN
        },
        {
          upsert: true
        }
      )
    }

    return true
  }
}
