import mongoose from 'mongoose'
import { ENROLLMENT_STAGE } from '../const/common'
const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    lecture: { type: mongoose.Types.ObjectId, ref: 'lecture' },
    current_step: {
      type: Number,
      required: true
    },
    stage: {
      type: Number,
      enum: [
        ENROLLMENT_STAGE.IN_PROGRESS,
        ENROLLMENT_STAGE.EXPLORE,
        ENROLLMENT_STAGE.FINISHED
      ],
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const EnrollmentModel = mongoose.model('enrollment', enrollmentSchema)
export default EnrollmentModel
