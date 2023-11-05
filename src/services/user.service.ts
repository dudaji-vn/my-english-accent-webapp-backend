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
        { lecture: lectureId },
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
      console.log({ nextStep, totalStep })

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
  async getMyPractice(me: string) {
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
          enrollments: { $size: 0 }
        }
      }
    ]
    const lectures = await LectureModel.aggregate(aggregateOpenLecture)
    const enrollmentByUserInprogress = await EnrollmentModel.find({
      user: me,
      stage: StageExercise.Inprogress
    }).populate('lecture')
    const enrollmentByUserClose = await EnrollmentModel.find({
      user: me,
      stage: StageExercise.Close
    }).populate('lecture')
    return {
      [StageExercise.Open]: lectures.map((item) => {
        return {
          currentStep: 0,
          enrollmentId: '',
          imgSrc: item.img_src,
          lectureId: item._id,
          lectureName: item.lecture_name,
          stage: StageExercise.Open,
          userId: ''
        }
      }),
      [StageExercise.Inprogress]: enrollmentByUserInprogress.map((item) =>
        convertToUserPractice(item)
      ),
      [StageExercise.Close]: enrollmentByUserClose.map((item) =>
        convertToUserPractice(item)
      )
    }
  }
}
