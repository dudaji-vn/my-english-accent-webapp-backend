import { injectable } from 'tsyringe'
import { StageExercise } from '../const/common'
import LectureModel from '../entities/Lecture'
import UserModel from '../entities/User'
import { IUserEnrollRequest, IUserUpdateDTO } from '../interfaces/dto/user.dto'
import EnrollmentModel from '../entities/Enrollment'
import { BaseService } from './base.service'
import { BadRequestError } from '../middleware/error'
import { convertToUserPractice } from '../coverter/user.mapping'
import VocabularyModel from '../entities/Vocabulary'
import mongoose from 'mongoose'

@injectable()
export default class UserService extends BaseService {
  async getAll() {
    return await UserModel.find()
  }
  async updateUser(updateData: IUserUpdateDTO, userId: string) {
    return await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true
    })
  }

  async addOrUpdateEnrollment(payload: IUserEnrollRequest) {
    const { lectureId, enrollmentId, user } = payload
    if (!lectureId) {
      throw new BadRequestError('lectureId is required')
    }
    if (!enrollmentId) {
      await EnrollmentModel.findOneAndUpdate(
        { lecture: lectureId, user: user },
        {
          current_step: 1,
          stage: StageExercise.Inprogress,
          user: user
        },
        { upsert: true }
      )

      return true
    } else {
      const enrollment = await EnrollmentModel.findById(enrollmentId)
      const totalStep = await VocabularyModel.countDocuments({
        lecture: lectureId
      })
      if (!enrollment) {
        throw new BadRequestError('enrollmentId not exist')
      }
      const nextStep = enrollment.current_step + 1

      await EnrollmentModel.findByIdAndUpdate(
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
      return true
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
        }
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
          totalStep: item.totalStep
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
