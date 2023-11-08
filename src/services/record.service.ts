import { injectable } from 'tsyringe'
import VocabularyModel from '../entities/Vocabulary'
import { StageExercise } from '../const/common'
import {
  IVocaByLectureRequest,
  IRecordRequest,
  IRecordByLectureRequest
} from '../interfaces/dto/record.dto'
import EnrollmentModel from '../entities/Enrollment'
import { convertToVocabularyDTO } from '../coverter/vocabulary.mapping'
import { BadRequestError } from '../middleware/error'
import RecordModel from '../entities/Record'
import mongoose from 'mongoose'
import LectureModel from '../entities/Lecture'
import { convertToRecordsByLectureDTO } from '../coverter/record.mapping'

@injectable()
export default class RecordService {
  async getAllVocabulariesByLectures(payload: IVocaByLectureRequest) {
    const { stage, lectureId, userId } = payload
    if (stage === StageExercise.Open) {
      const vocabularies = await VocabularyModel.find({ lecture: lectureId })
      return {
        currentStep: 0,
        enrollmentId: null,
        lectureId: lectureId,
        stage: StageExercise.Open,
        vocabularies: vocabularies
      }
    }
    const currentEnrollMent = await EnrollmentModel.findOne({
      user: userId,
      lecture: lectureId
    })
    const vocabularies = await VocabularyModel.find({ lecture: lectureId })
    return {
      currentStep: currentEnrollMent?.current_step,
      enrollmentId: currentEnrollMent?._id,
      lectureId: lectureId,
      stage: currentEnrollMent?.stage,
      vocabularies: vocabularies.map((item: any) =>
        convertToVocabularyDTO(item)
      )
    }
  }

  async getMyRecordsByLecture(payload: IRecordByLectureRequest) {
    const { lectureId, userId } = payload
    const aggregateQuery = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(lectureId)
        }
      },
      {
        $lookup: {
          from: 'vocabularies',
          localField: '_id',
          foreignField: 'lecture',
          as: 'vocabularies'
        }
      },
      {
        $lookup: {
          from: 'records',
          localField: 'vocabularies._id',
          foreignField: 'vocabulary',
          as: 'records'
        }
      },
      {
        $addFields: {
          'vocabularies.record': {
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
                          new mongoose.Types.ObjectId(userId)
                        ]
                      },
                      { $not: { $ifNull: ['$$record.challenge', false] } }
                    ]
                  }
                }
              },
              0
            ]
          }
        }
      }
    ]
    const data = await LectureModel.aggregate(aggregateQuery)
    return data.map((item) => convertToRecordsByLectureDTO(item))
  }
  async addRecord(payload: IRecordRequest) {
    const { challengeId, userId, vocabularyId, voiceSrc } = payload
    if (!vocabularyId || !voiceSrc) {
      throw new BadRequestError('Fields required: vocabularyId, voiceSrc')
    }
    await RecordModel.create({
      challenge: challengeId,
      user: userId,
      vocabulary: vocabularyId,
      voice_src: voiceSrc
    })
    return true
  }
}
