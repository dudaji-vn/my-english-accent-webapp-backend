import mongoose from 'mongoose'

const userCertificateContentSchema = new mongoose.Schema(
  {
    certificate_id: {
      type: mongoose.Types.ObjectId,
      ref: 'certificate',
      required: true
    },
    user_id: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    records: [
      {
        vocabulary_id: {
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
    star: { type: Number, required: true }
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
