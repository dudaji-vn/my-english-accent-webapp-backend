import mongoose from 'mongoose'
import { injectable } from 'tsyringe'
import { STATUS_LECTURE, StageExercise } from '../const/common'
import { convertToEnrollmentDTO } from '../coverter/enrollment.mapping'
import {
  convertToUserDTO,
  convertToUserPractice
} from '../coverter/user.mapping'
import EnrollmentModel from '../entities/Enrollment'
import LectureModel from '../entities/Lecture'
import UserModel from '../entities/User'
import VocabularyModel from '../entities/Vocabulary'
import { IUserEnrollRequest } from '../interfaces/dto/user.dto'
import { BadRequestError } from '../middleware/error'
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
        { $sort: { created: sort, lecture_name: sort } }
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
      })
        .sort({ created: (sort ?? 1) as any })
        .populate('lecture')
      return await Promise.all(
        enrollmentByUserInprogress.map(async (item: any) => {
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
      })
        .sort({ created: (sort ?? 1) as any })
        .populate('lecture')
      return await Promise.all(
        enrollmentByUserClose.map(async (item: any) => {
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
        return (await getLecturesInProgress()).filter(
          (item) => item.totalStep > 0
        )
      case StageExercise.Close:
        return (await getLectureClose()).filter((item) => item.totalStep > 0)
      default:
        return (await getLecturesOpen()).filter((item) => item.totalStep > 0)
    }
  }
}
