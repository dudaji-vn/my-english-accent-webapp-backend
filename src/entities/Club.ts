import mongoose from 'mongoose'

const clubSchema = new mongoose.Schema(
  {
    owner_user: { type: mongoose.Types.ObjectId, ref: 'user' },
    club_name: {
      type: String
    },
    description: {
      type: String
    },
    lectures: [{ type: mongoose.Types.ObjectId, ref: 'lecture' }],
    members: [{ type: mongoose.Types.ObjectId, ref: 'user' }]
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const ClubModel = mongoose.model('club', clubSchema)
export default ClubModel
