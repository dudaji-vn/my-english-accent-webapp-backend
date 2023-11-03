import mongoose from 'mongoose'

const challengeSchema = new mongoose.Schema(
  {
    club: { type: mongoose.Types.ObjectId, ref: 'club' },
    challenge_name: {
      type: String
    },
    participants: [{ type: mongoose.Types.ObjectId, ref: 'user' }]
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const ChallengeModel = mongoose.model('challenge', challengeSchema)
export default ChallengeModel
