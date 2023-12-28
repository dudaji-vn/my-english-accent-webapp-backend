import { injectable } from 'tsyringe'
import VocabularyModel from '../entities/Vocabulary'
import { STATUS_LECTURE, StageExercise } from '../const/common'
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
  async getMyRecordsByLecture(payload: IRecordByLectureRequest) {
    const { lectureId, userId } = payload
    const aggregateQuery = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(lectureId),
          status: STATUS_LECTURE.PUBLIC
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
        $unwind: '$vocabularies'
      },
      {
        $lookup: {
          from: 'records',
          let: { voca: '$vocabularies._id' },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $and: [
                        { $eq: ['$vocabulary', '$$voca'] },
                        { $eq: ['$user', new mongoose.Types.ObjectId(userId)] }
                      ]
                    }
                  },
                  {
                    challenge: { $eq: null }
                  }
                ]
              }
            },
            { $limit: 1 }
          ],
          as: 'vocabularies.record'
        }
      },
      // {
      //   $match: {
      //     'vocabularies.record': { $ne: [] }
      //   }
      // },
      {
        $addFields: {
          'vocabularies.record': { $arrayElemAt: ['$vocabularies.record', 0] }
        }
      },
      {
        $group: {
          _id: '$_id',
          lecture_name: { $first: '$lecture_name' },
          img_src: { $first: '$img_src' },
          created: { $first: '$created' },
          updated: { $first: '$updated' },
          vocabularies: { $push: '$vocabularies' }
        }
      }
    ]
    const data = await LectureModel.aggregate(aggregateQuery)
    return data.map((item) => convertToRecordsByLectureDTO(item))[0]
  }
  async addOrUpdateRecord(payload: IRecordRequest) {
    const { challengeId, userId, vocabularyId, voiceSrc } = payload
    if (!vocabularyId || !voiceSrc) {
      throw new BadRequestError('Fields required: vocabularyId, voiceSrc')
    }
    let record
    if (!challengeId) {
      //if not found //case add=>add enrollment

      record = await RecordModel.findOneAndUpdate(
        {
          user: userId,
          vocabulary: vocabularyId,
          challenge: null
        },
        { voice_src: voiceSrc },
        { upsert: true, new: true }
      )
    } else {
      record = await RecordModel.findOneAndUpdate(
        { user: userId, vocabulary: vocabularyId, challenge: challengeId },
        { voice_src: voiceSrc },
        { upsert: true }
      )
    }

    return record?._id
  }
}
