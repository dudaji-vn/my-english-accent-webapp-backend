// @ts-nocheck
import mongoose from 'mongoose'
import { injectable } from 'tsyringe'
import {
  EVENTS,
  STATUS_LECTURE,
  STATUS_USER_EVENT,
  StageExercise
} from '../const/common'
import { convertToEnrollmentDTO } from '../coverter/enrollment.mapping'
import { convertToUserDTO } from '../coverter/user.mapping'
import EnrollmentModel from '../entities/enrollment.entity'
import GoogleRecognitionModel from '../entities/google-recognition.entity'
import LectureModel from '../entities/lecture.entity'
import RankingModel from '../entities/ranking.entity'
import RecordModel from '../entities/record.entity'
import UserWinEventModel from '../entities/user-win-event.entity'
import UserModel from '../entities/user.entity'
import VocabularyModel from '../entities/vocabulary.entity'
import { IUserDAO } from '../interfaces/dao/user.dao'
import {
  IAddOrUpdateGoogleTranscriptRequest,
  IUpdateProfile,
  IUserEnrollRequest,
  IUserRankingRequest
} from '../interfaces/dto/user.dto'
import { BadRequestError } from '../middleware/error.middleware'
import { BaseService } from './base.service'

@injectable()
export default class UserService extends BaseService {
  async getAll(me: string) {
    const data = await UserModel.find()
      .find({ _id: { $ne: me } })
      .lean()
    return data.map((item: any) => convertToUserDTO(item))
  }

  async addOrUpdateEnrollment(payload: IUserEnrollRequest) {
    const { lectureId, enrollmentId, user } = payload
    if (!lectureId) {
      throw new BadRequestError('lectureId is required')
    }
    const totalStep = await VocabularyModel.countDocuments({
      lecture: lectureId
    })
    if (!enrollmentId) {
      if (totalStep === 1) {
        await UserModel.findByIdAndUpdate(
          user,
          { $addToSet: { completed_lecture_ids: [lectureId] } },
          { new: true }
        )
      }
      const data = await EnrollmentModel.findOneAndUpdate(
        { lecture: lectureId, user: user },
        {
          current_step: 1,
          stage:
            totalStep === 1 ? StageExercise.Close : StageExercise.Inprogress,
          user: user
        },
        { upsert: true, new: true }
      )

      return convertToEnrollmentDTO(data)
    } else {
      const enrollment = await EnrollmentModel.findById(enrollmentId)

      if (!enrollment) {
        throw new BadRequestError('enrollmentId not exist')
      }
      const nextStep = enrollment.current_step + 1

      if (nextStep >= totalStep) {
        await UserModel.findByIdAndUpdate(
          user,
          { $addToSet: { completed_lecture_ids: [lectureId] } },
          { new: true }
        )
      }

      const data = await EnrollmentModel.findByIdAndUpdate(
        enrollmentId,
        {
          stage:
            nextStep >= totalStep
              ? StageExercise.Close
              : StageExercise.Inprogress,
          current_step: nextStep >= totalStep ? totalStep : nextStep
        },
        { new: true }
      )
      return convertToEnrollmentDTO(data)
    }
  }
  async getMyPractice(me: string, stage: StageExercise, sort: number) {
    const getLecturesOpen = async () => {
      const aggregateOpenLecture = [
        {
          $lookup: {
            from: 'enrollments',
            localField: '_id',
            foreignField: 'lecture',
            as: 'enrollments'
          }
        },
        {
          $match: {
            status: STATUS_LECTURE.PUBLIC,
            'enrollments.user': { $ne: new mongoose.Types.ObjectId(me) }
          }
        },
        {
          $lookup: {
            from: 'vocabularies',
            localField: '_id',
            foreignField: 'lecture',
            as: 'vocabulary'
          }
        },
        {
          $addFields: {
            totalStep: {
              $size: {
                $filter: {
                  input: { $concatArrays: ['$vocabulary'] },
                  as: 'voc',
                  cond: { $eq: ['$$voc.lecture', '$_id'] }
                }
              }
            }
          }
        },
        { $sort: { lecture_name: sort } }
      ]
      try {
        const lectures = await LectureModel.aggregate(
          aggregateOpenLecture as any
        ).exec()
        return lectures.map((item) => ({
          currentStep: 0,
          enrollmentId: '',
          imgSrc: item.img_src,
          lectureId: item._id,
          lectureName: item.lecture_name,
          stage: StageExercise.Open,
          totalStep: item.totalStep,
          created: item.created
        }))
      } catch (error) {
        console.error('Error in getLecturesOpen:', error)
        throw error
      }
    }

    const getLecturesBy = async (userId: string, stage: StageExercise) => {
      const aggQuery = [
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            stage: stage
          }
        },
        {
          $lookup: {
            from: 'lectures',
            localField: 'lecture',
            foreignField: '_id',
            as: 'lectures'
          }
        },
        {
          $lookup: {
            from: 'vocabularies',
            localField: 'lecture',
            foreignField: 'lecture',
            as: 'voca'
          }
        },

        {
          $lookup: {
            from: 'records',
            localField: 'voca._id',
            foreignField: 'vocabulary',
            pipeline: [
              {
                $match: { score: 1, user: new mongoose.Types.ObjectId(userId) }
              }
            ],
            as: 'records'
          }
        },
        {
          $addFields: {
            lecture: { $first: '$lectures' },
            totalPoint: { $size: '$records' },
            totalStep: { $size: '$voca' }
          }
        },
        {
          $match: {
            'lecture.status': STATUS_LECTURE.PUBLIC,
            totalStep: { $gt: 0 }
          }
        },
        {
          $project: {
            _id: 0,
            lectureId: '$lecture._id',
            lectureName: '$lecture.lecture_name',
            imgSrc: '$lecture.img_src',
            stage: '$stage',
            currentStep: '$current_step',
            enrollmentId: '$_id',
            userId: '$user',
            totalStep: '$totalStep',
            totalPoint: '$totalPoint'
          }
        },
        {
          $sort: {
            lectureName: 1
          }
        }
      ]
      return await EnrollmentModel.aggregate(aggQuery)
    }
    switch (+stage) {
      case StageExercise.Inprogress:
        return await getLecturesBy(me, StageExercise.Inprogress)
      case StageExercise.Close:
        return await getLecturesBy(me, StageExercise.Close)

      default:
        return (await getLecturesOpen()).filter((item) => item.totalStep > 0)
    }
  }
  async checkUserWinEvent({
    user_id,
    language
  }: {
    user_id: string
    language: string
  }) {
    const MAX_WINNER = 50
    const NUM_LECTURE_ARCHIVE = 10
    const EVENT = language == 'vn' ? EVENTS.GRAB_GIFT_VN : EVENTS.GRAB_GIFT_KR

    const isUserWin = await UserWinEventModel.findOne({
      event: EVENT,
      user: user_id
    })
    if (isUserWin) {
      return {
        status: STATUS_USER_EVENT.ALREADLY_WIN,
        message: 'You have already won this event'
      }
    }

    const numUserWin = await UserWinEventModel.countDocuments({
      event: EVENT,
      user: user_id
    })
    if (numUserWin >= MAX_WINNER) {
      return {
        status: STATUS_USER_EVENT.MAX_WINNER,
        message: 'This event has reached the maximum number of winners'
      }
    }

    const numLectureUserComplete = await EnrollmentModel.countDocuments({
      user: user_id,
      stage: StageExercise.Close
    })
    if (numLectureUserComplete == NUM_LECTURE_ARCHIVE) {
      await UserWinEventModel.create({ event: EVENT, user: user_id })
      return {
        status: STATUS_USER_EVENT.WIN,
        message: 'You have won this event'
      }
    }

    return {
      status: STATUS_USER_EVENT.NOT_COMPLETE,
      message: 'You have not completed all the lectures'
    }
  }
  async addOrUpdateGoogleTranscript(
    payload: IAddOrUpdateGoogleTranscriptRequest
  ) {
    const { finalTranscript, transcripts, recordId } = payload
    await GoogleRecognitionModel.create({
      record: recordId,
      transcripts: transcripts,
      final_transcript: finalTranscript
    })
    return true
  }
  async updateProfile(payload: IUpdateProfile) {
    const { avatarUrl, nativeLanguage, nickName, userId } = payload
    if (!userId) {
      throw new BadRequestError('not found userId')
    }
    const updateData: IUserDAO = {}

    if (avatarUrl) {
      updateData.avatar_url = avatarUrl
    }
    if (nativeLanguage || ['vn', 'kr'].includes(nativeLanguage)) {
      updateData.native_language = nativeLanguage
    }
    if (nickName) {
      updateData.nick_name = nickName
    }
    if (Object.keys(updateData).length === 0) {
      return null
    }
    const user = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true
    })
    return {
      nickName: user?.nick_name,
      avatarUrl: user?.avatar_url,
      nativeLanguage: user?.native_language
    }
  }
  async getUsersRanking(user: IUserDAO) {
    if (user.completed_lecture_ids?.length === 0) {
      return null
    }
    const usersCompletedLectures = await UserModel.find({
      'completed_lecture_ids.0': { $exists: true }
    })
      .select('_id')
      .lean()
    const userIds = usersCompletedLectures.map((item) => item._id)

    const records = await RecordModel.aggregate([
      {
        $match: {
          user: { $in: userIds },
          score: { $gte: 0 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'vocabularies',
          localField: 'vocabulary',
          foreignField: '_id',
          as: 'vocabulary'
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] },
          vocabulary: { $arrayElemAt: ['$vocabulary', 0] }
        }
      },
      {
        $project: {
          user: {
            _id: 1,
            nick_name: 1,
            avatar_url: 1,
            native_language: 1,
            completed_lecture_ids: '$user.completed_lecture_ids'
          },
          vocabulary: 1,
          score: 1
        }
      },
      {
        $match: {
          $expr: { $in: ['$vocabulary.lecture', '$user.completed_lecture_ids'] }
        }
      },
      {
        $group: {
          _id: '$user._id',
          user: { $first: '$user' },
          total_score: { $sum: '$score' }
        }
      },

      {
        $sort: {
          total_score: -1
        }
      },
      {
        $project: {
          userId: '$user._id',
          nickName: '$user.nick_name',
          avatarUrl: '$user.avatar_url',
          totalScore: '$total_score',
          isMe: {
            $cond: {
              if: {
                $eq: ['$user._id', new mongoose.Types.ObjectId(user._id)]
              },
              then: true,
              else: false
            }
          },
          nativeLanguage: '$user.native_language'
        }
      }
    ])
    return records.map((item, index) => {
      return {
        ranking: index + 1,
        ...item
      }
    })
  }
  async getPlaylistSummaryByUser(userId) {
    const user = await UserModel.findById(userId)
      .populate({
        path: 'completed_lecture_ids',
        match: { status: STATUS_LECTURE.PUBLIC }
      })
      .select('nick_name completed_lecture_ids')
    if (!user) {
      throw new BadRequestError('user not found')
    }
    return {
      userId: user?._id,
      nickName: user?.nick_name,
      lectures: user.completed_lecture_ids
        .map((item) => {
          return {
            lectureName: item.lecture_name,
            imgSrc: item.img_src,
            lectureId: item._id
          }
        })
        .sort((a, b) => a.lectureName.localeCompare(b.lectureName))
    }
  }
  async getPlaylistByUser(payload: IUserRankingRequest) {
    const { lectureId, userId, me } = payload
    const ranking = await RankingModel.findOne({
      lecture: lectureId,
      user: userId
    })

    const vocabularyIds = await VocabularyModel.find({
      lecture: lectureId
    })
      .select('_id')
      .lean()

    const results = await RecordModel.find({
      user: userId,
      vocabulary: { $in: vocabularyIds.map((item) => item._id.toString()) }
    })
      .populate({
        path: 'vocabulary',
        select: 'title_display_language phonetic_display_language'
      })
      .select('voice_src vocabulary')
      .lean()

    return {
      likes: ranking?.likes.length ?? 0,
      isLiked: ranking?.likes.some((item) => item.toString() === me.toString()),
      records: results.map((item) => {
        return {
          recordId: item._id,
          voiceSrc: item.voice_src,
          title: item.vocabulary.title_display_language,
          phonetic: item.vocabulary.phonetic_display_language
        }
      })
    }
  }
  async likeOrUnlikePlaylistByUser(payload: IUserRankingRequest) {
    const { me, userId, lectureId, emoji } = payload

    if (emoji === 'like') {
      await RankingModel.findOneAndUpdate(
        {
          user: userId,
          lecture: lectureId
        },
        {
          $addToSet: { likes: [me] }
        },
        {
          upsert: true
        }
      )
      return true
    }

    await RankingModel.findOneAndUpdate(
      {
        user: userId,
        lecture: lectureId
      },
      {
        $pull: { likes: me }
      },
      {
        upsert: true
      }
    )
    return true
  }
}
