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
  auth,
  catchAsync(lectureController.getAllLectures.bind(lectureController))
)
lectureRouter.get(
  '/allForAdmin',
  auth,
  catchAsync(lectureController.getAllLecturesForAdmin.bind(lectureController))
)
lectureRouter.put(
  '/addLectureAndVocabulary',
  auth,
  catchAsync(lectureController.addLectureAndVocabulary.bind(lectureController))
)
lectureRouter.put(
  '/changeStatusLecture',
  auth,
  catchAsync(lectureController.changeStatusLecture.bind(lectureController))
)
export default lectureRouter
