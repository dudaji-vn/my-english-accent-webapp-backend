import mongoose from 'mongoose'

const googleRecognition = new mongoose.Schema(
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

const GoogleRecognition = mongoose.model(
  'google_recognition',
  googleRecognition
)
export default GoogleRecognition
