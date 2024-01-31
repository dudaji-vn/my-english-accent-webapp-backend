import mongoose from 'mongoose'

const rankingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    lecture: {
      type: mongoose.Types.ObjectId,
      ref: 'lecture'
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user'
      }
    ]
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const RankingModel = mongoose.model('ranking', rankingSchema)
export default RankingModel
