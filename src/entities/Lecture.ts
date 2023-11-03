import mongoose from 'mongoose'
import { CLASS } from '../const/common'
const lectureSchema = new mongoose.Schema(
  {
    description: {
      type: String
    },
    class: {
      type: Number,
      enum: [CLASS.Designer, CLASS.Developer, CLASS.Other],
      required: true
    },
    lecture_name: {
      type: String
    },
    img_src: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }
  }
)

const LectureModel = mongoose.model('lecture', lectureSchema)
export default LectureModel
