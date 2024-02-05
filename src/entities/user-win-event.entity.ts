import mongoose from 'mongoose'
import { EVENTS } from '../const/common'

const userWinEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'user' },
    event: { type: String, required: true, enum: EVENTS },
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const UserWinEventModel = mongoose.model('user_win_event', userWinEventSchema)
export default UserWinEventModel
