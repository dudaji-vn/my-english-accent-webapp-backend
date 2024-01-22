import mongoose from 'mongoose'
import uniqueSlug from 'unique-slug'

const userCertificateContentSchema = new mongoose.Schema(
  {
    certificate: {
      type: mongoose.Types.ObjectId,
      ref: 'certificate',
      required: true
    },
    user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    slug: {
      type: String,
      default: uniqueSlug()
    },
    records: [
      {
        vocabulary: {
          type: mongoose.Types.ObjectId,
          ref: 'vocabulary',
          required: true
        },
        voice_src: {
          type: String,
          required: true
        },
        result: {
          type: String,
          required: true
        }
      }
    ],
    score: { type: Number, required: true },
    star: { type: Number, required: true },
    correct_sentences: { type: Number, default: 0 }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const UserCertificateModel = mongoose.model(
  'user_certificate',
  userCertificateContentSchema
)
export default UserCertificateModel
