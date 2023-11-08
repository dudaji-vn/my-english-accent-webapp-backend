import { injectable } from 'tsyringe'
import NativeTranslationModel from '../entities/NativeTranslation'
import {
  convertToVocabularyDTO,
  convertToVocabularyWithNativeDTO
} from '../coverter/vocabulary.mapping'
import { IVocaByLectureRequest } from '../interfaces/dto/record.dto'
import { StageExercise } from '../const/common'
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
    const { stage, lectureId, userId } = payload
    const aggQuery = [
      {
        $match: {
          lecture: new mongoose.Types.ObjectId(lectureId)
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
          _id: '$voca_native._id',
          title_native_language: '$voca_native.title_native_language',
          native_language: '$voca_native.native_language'
        }
      }
    ]
    if (stage === StageExercise.Open) {
      const vocabularies = await VocabularyModel.aggregate(aggQuery)
      return {
        currentStep: 0,
        enrollmentId: null,
        lectureId: lectureId,
        stage: StageExercise.Open,
        vocabularies: vocabularies.map((item: any) =>
          convertToVocabularyWithNativeDTO(item)
        )
      }
    }
    const currentEnrollMent = await EnrollmentModel.findOne({
      user: userId,
      lecture: lectureId
    })
    const vocabularies = await VocabularyModel.aggregate(aggQuery)
    return {
      currentStep: currentEnrollMent?.current_step ?? 0,
      enrollmentId: currentEnrollMent?._id,
      lectureId: lectureId,
      stage: currentEnrollMent?.stage,
      vocabularies: vocabularies.map((item: any) =>
        convertToVocabularyWithNativeDTO(item)
      )
    }
  }
}
