import { injectable } from 'tsyringe'
import UserModel from '../entities/User'
import LectureModel from '../entities/Lecture'
import RecordModel from '../entities/Record'

import mongoose from 'mongoose'
import EnrollmentModel from '../entities/Enrollment'

@injectable()
export default class DashboardService {
  async getAnalyst() {
    const totalUser = await UserModel.countDocuments()
    const totalLectures = await LectureModel.countDocuments()
    const totalCompletedRecordUser = await UserModel.countDocuments({
      'completed_lecture_ids.0': { $exists: true }
    })
    return {
      totalLectures,
      totalUser,
      totalCompletedRecordUser
    }
  }
  async syncData() {
    const enrollment = await EnrollmentModel.find({
      user: new mongoose.Types.ObjectId('655c69e54ced2f1d57317161'),
      created: { $gte: new Date('2023-12-05T00:00:00.000Z') }
    }).populate('lecture')
    const record = await RecordModel.find({
      user: new mongoose.Types.ObjectId('655c69e54ced2f1d57317161'),
      created: { $gte: new Date('2023-12-05T00:00:00.000Z') }
    })
    return {
      enrollment: enrollment,
      record: record,
      count: record.length
    }
  }
}
