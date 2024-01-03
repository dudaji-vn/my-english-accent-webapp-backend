import mongoose from 'mongoose'

const googleRecognitionSchema = new mongoose.Schema(
  {
    record: { type: mongoose.Types.ObjectId, ref: 'record' },
    transcripts: [
      {
        transcript: String,
        confidence: Number
      }
    ],
    final_transcript: { type: String }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const GoogleRecognitionModel = mongoose.model(
  'google_recognition',
  googleRecognitionSchema
)
export default GoogleRecognitionModel
