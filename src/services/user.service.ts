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
import {
  convertToUserDTO,
  convertToUserPractice
} from '../coverter/user.mapping'
import EnrollmentModel from '../entities/Enrollment'
import LectureModel from '../entities/Lecture'
import UserModel from '../entities/User'
import VocabularyModel from '../entities/Vocabulary'
import {
  IAddOrUpdateGoogleTranscriptRequest,
  IUpdateProfile,
  IUserEnrollRequest
} from '../interfaces/dto/user.dto'
import { BadRequestError } from '../middleware/error'
import { BaseService } from './base.service'
import UserWinEventModel from '../entities/UserWinEvent'
import GoogleRecognitionModel from '../entities/GoogleRecognition'
import { IUserDAO } from '../interfaces/dao/user.dao'

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
    const getLecturesInProgress = async () => {
      const enrollmentByUserInprogress = await EnrollmentModel.find({
        user: me,
        stage: StageExercise.Inprogress
      }).populate('lecture')

      return await Promise.all(
        enrollmentByUserInprogress
          .filter((item) => item?.lecture?.status === STATUS_LECTURE.PUBLIC)
          .map(async (item: any) => {
            const total_step = await VocabularyModel.countDocuments({
              lecture: item.lecture
            })
            item.total_step = total_step
            return convertToUserPractice(item)
          })
      )
    }
    const getLectureClose = async () => {
      const enrollmentByUserClose = await EnrollmentModel.find({
        user: me,
        stage: StageExercise.Close
      }).populate('lecture')
      return await Promise.all(
        enrollmentByUserClose
          .filter((item) => item?.lecture?.status === STATUS_LECTURE.PUBLIC)
          .map(async (item: any) => {
            const total_step = await VocabularyModel.countDocuments({
              lecture: item.lecture
            })
            item.total_step = total_step
            return convertToUserPractice(item)
          })
      )
    }
    switch (+stage) {
      case StageExercise.Inprogress:
        return (await getLecturesInProgress())
          .filter((item) => item.totalStep > 0)
          .sort((a, b) => a.lectureName.localeCompare(b.lectureName))
      case StageExercise.Close:
        return (await getLectureClose())
          .filter((item) => item.totalStep > 0)
          .sort((a, b) => a.lectureName.localeCompare(b.lectureName))
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
}
