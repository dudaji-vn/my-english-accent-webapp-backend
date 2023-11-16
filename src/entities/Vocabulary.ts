import mongoose from 'mongoose'
const vocabularySchema = new mongoose.Schema(
  {
    number_order: { type: Number, default: 0 },
    lecture: { type: mongoose.Types.ObjectId, ref: 'lecture' },
    phonetic_display_language: {
      type: String,
      required: true
    },
    title_display_language: {
      type: String,
      required: true
    },
    text_translate: {
      vn: {
        type: String,
        required: true
      },
      kr: {
        type: String,
        required: true
      }
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
