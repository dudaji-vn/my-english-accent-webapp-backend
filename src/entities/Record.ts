import mongoose from 'mongoose'
const recordSchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Types.ObjectId,
      ref: 'challenge',
      default: null
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user'
    },
    vocabulary: {
      type: mongoose.Types.ObjectId,
      ref: 'vocabulary'
    },
    voice_src: {
      type: String,
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

const RecordModel = mongoose.model('record', recordSchema)
export default RecordModel
