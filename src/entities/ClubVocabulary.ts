import mongoose from 'mongoose'

const clubVocabularySchema = new mongoose.Schema(
  {
    challenge: { type: mongoose.Types.ObjectId, ref: 'challenge' },
    number: {
      type: Number
    },
    vocabulary: { type: mongoose.Types.ObjectId, ref: 'vocabulary' }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const ClubVocabularyModel = mongoose.model(
  'club_vocabulary',
  clubVocabularySchema
)
export default ClubVocabularyModel
