// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import LectureController from '../../controllers/lecture.controller'
import { catchAsync } from '../../middleware/catchAsync'
import auth from '../../middleware/auth'
const lectureController =
  container.resolve<LectureController>(LectureController)

const lectureRouter = express.Router()

lectureRouter.get(
  '/all',
  catchAsync(lectureController.getAllLectures.bind(lectureController))
)

export default lectureRouter
