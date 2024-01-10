import mongoose from 'mongoose'
import { CERTIFICATE_TYPE } from '../const/common'

const certificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: Number,
      required: true,
      default: CERTIFICATE_TYPE.VOCABULARY
    },
    img_url: {
      type: String,
      default: null
    },
    archived_img_url: {
      type: String,
      default: null
    },
    total_score: {
      type: Number,
      required: true
    },
    contents: [
      {
        order: { type: Number, required: true },
        vocabulary_id: {
          type: mongoose.Types.ObjectId,
          ref: 'vocabulary',
          default: null
        }
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

const CertificateModel = mongoose.model('certificate', certificateSchema)
export default CertificateModel
