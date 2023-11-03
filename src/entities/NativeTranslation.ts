import mongoose from 'mongoose'
import { CLASS } from '../const/common'
const nativeTranslationSchema = new mongoose.Schema(
  {
    native_language: {
      type: String,
      enum: ['vn', 'kr', 'us'],
      required: true
    },
    title_native_language: {
      type: String,
      required: true
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

const NativeTranslationModel = mongoose.model(
  'native_translation',
  nativeTranslationSchema
)
export default NativeTranslationModel
