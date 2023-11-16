import mongoose from 'mongoose'
export type Role = 'developer' | 'designer' | 'others'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    google_id: {
      type: String,
      required: true
    },
    avatar_url: {
      type: String
    },
    nick_name: {
      type: String,
      required: true
    },
    native_language: {
      type: String,
      enum: ['vn', 'kr', 'us'],
      required: true
    },
    display_language: {
      type: String,
      required: true
    },
    user_name: {
      type: String
    },
    password: {
      type: String
    },
    completed_lecture_ids: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'lecture' }],
      default: []
    },
    favorite_user_ids: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
      default: []
    },
    favorite_lecture_ids: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'lecture' }],
      default: []
    }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const UserModel = mongoose.model('user', userSchema)
export default UserModel
