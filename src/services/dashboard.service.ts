import { injectable } from 'tsyringe'
import UserModel from '../entities/User'
import LectureModel from '../entities/Lecture'

import EnrollmentModel from '../entities/Enrollment'
import { ENROLLMENT_STAGE } from '../const/common'
import { convertToUserDTO } from '../coverter/user.mapping'
import { IUserDAO } from '../interfaces/dao/user.dao'

@injectable()
export default class DashboardService {
  async getAnalyst() {
    const [
      totalUser,
      totalLectures,
      totalUserVN,
      totalUserKR,
      totalCompletedRecordUser
    ] = await Promise.all([
      UserModel.countDocuments(),
      LectureModel.countDocuments(),
      UserModel.countDocuments({ native_language: 'vn' }),
      UserModel.countDocuments({ native_language: 'kr' }),
      UserModel.countDocuments({ 'completed_lecture_ids.0': { $exists: true } })
    ])

    return {
      totalLectures,
      totalUser,
      totalCompletedRecordUser,
      totalUserVN,
      totalUserKR
    }
  }
  async getTopUserCompleteLecture(country: string, numberLecture: number = 1) {
    const numberUser = 50

    const users = await UserModel.aggregate([
      {
        $match: {
          $expr: { $gte: [{ $size: '$completed_lecture_ids' }, numberLecture] },
          native_language: country ?? 'kr'
        }
      },
      {
        $limit: numberUser
      }
    ])

    const listUserIds = users.map((item) => item._id)
    const enrollments = await EnrollmentModel.find({
      user: { $in: listUserIds },
      stage: ENROLLMENT_STAGE.FINISHED
    })
    if (!enrollments) {
      return []
    }

    return users
      .map((user: IUserDAO) => {
        const enrollment = enrollments.find((item) => {
          return (
            item.user?.toString() === user._id?.toString() &&
            item.lecture?.toString() ===
              user.completed_lecture_ids
                ?.slice(0, numberLecture)
                .pop()
                ?.toString()
          )
        }) as any
        return {
          lastCompleted: enrollment?.updated,
          ...convertToUserDTO(user)
        }
      })
      .sort(
        (a, b) =>
          new Date(a.lastCompleted).getTime() -
          new Date(b.lastCompleted).getTime()
      )
  }
  async syncData() {
    return 'Sync data'
  }

  async getTop5Lectures() {
    const topLectures = await EnrollmentModel.aggregate([
      {
        $match: {
          stage: 2
        }
      },
      {
        $group: {
          _id: '$lecture',
          enrollments: { $push: '$$ROOT' }
        }
      },
      {
        $addFields: {
          total: { $size: '$enrollments' }
        }
      },
      {
        $sort: {
          total: -1
        }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'lectures',
          localField: '_id',
          foreignField: '_id',
          as: 'lecture'
        }
      }
    ])
    if (!topLectures) {
      return []
    }
    return topLectures.map((item) => {
      return {
        lectureName: item.lecture[0].lecture_name,
        total: item.total
      }
    })
  }
}
