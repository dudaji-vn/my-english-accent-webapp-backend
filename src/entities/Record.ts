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
    },
    final_transcript: {
      type: String
    },
    score: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)
recordSchema.index({ user: 1, vocabulary: 1 })
const RecordModel = mongoose.model('record', recordSchema)

export default RecordModel
