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

@injectable()
export default class VocabularyService {
  async getVocabularyById(vocabularyId: string) {
    const vocabularies = await NativeTranslationModel.find({
      vocabulary: vocabularyId
    }).populate('vocabulary')
    return vocabularies.map((item: any) =>
      convertToVocabularyWithNativeDTO(item)
    )
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
    const aggQuery = [
      {
        $match: {
          lecture: new mongoose.Types.ObjectId(lectureId)
        }
      },

      {
        $lookup: {
          from: 'lectures',
          localField: 'lecture',
          foreignField: '_id',
          as: 'lecture'
        }
      },
      {
        $unwind: '$lecture'
      },
      {
        $lookup: {
          from: 'native_translations',
          localField: '_id',
          foreignField: 'vocabulary',
          as: 'native_translations'
        }
      },
      {
        $unwind: '$native_translations'
      }
    ]
    const listVoca = await VocabularyModel.find({
      lecture: lectureId
    })
      .lean()
      .populate('lecture')

    const listVocaPromise = listVoca.map(async (item) => {
      const textVn = await NativeTranslationModel.findOne({
        vocabulary: item._id,
        native_language: Language.Vn
      }).lean()
      const textKorean = await NativeTranslationModel.findOne({
        vocabulary: item._id,
        native_language: Language.Kr
      }).lean()

      return {
        textVN: textVn?.title_native_language ?? '',
        textKR: textKorean?.title_native_language ?? '',
        ...convertToDetailVocabularyByLecture(item)
      }
    })

    return await Promise.all(listVocaPromise)
  }
}
