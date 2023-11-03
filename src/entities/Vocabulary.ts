import mongoose from 'mongoose'
const vocabularySchema = new mongoose.Schema(
  {
    lecture: { type: mongoose.Types.ObjectId, ref: 'lecture' },
    phonetic_display_language: {
      type: String,
      required: true
    },
    title_display_language: {
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

const VocabularyModel = mongoose.model('vocabulary', vocabularySchema)

export default VocabularyModel
