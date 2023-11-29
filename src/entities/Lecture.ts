import mongoose from 'mongoose'
import { STATUS_STAGE as STATUS_LECTURE } from '../const/common'
const lectureSchema = new mongoose.Schema(
  {
    description: {
      type: String
    },
    lecture_name: {
      type: String,
      required: true,
      unique: true
    },
    img_src: {
      type: String,
      default:
        'https://res.cloudinary.com/hoquanglinh/image/upload/v1700118507/sudq1kkwlrlfj18afaic.png'
    },
    status: {
      type: Number,
      enum: [STATUS_LECTURE.DRAFT, STATUS_LECTURE.PUBLIC],
      required: true
    },
    publishedAt: {
      type: Date,
      default: null
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
