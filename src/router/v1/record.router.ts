// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import RecordController from '../../controllers/record.controller'
import auth from '../../middleware/auth'
import { catchAsync } from '../../middleware/catchAsync'
const recordController = container.resolve<RecordController>(RecordController)

const recordRouter = express.Router()

recordRouter.get(
  '/getAllVocabulariesByLecture',
  auth,
  catchAsync(
    recordController.getAllVocabulariesByLectures.bind(recordController)
  )
)
recordRouter.post(
  '/addRecord',
  auth,
  catchAsync(recordController.addRecord.bind(recordController))
)

recordRouter.get(
  '/getMyRecordsByLecture',
  auth,
  catchAsync(recordController.getMyRecordsByLecture.bind(recordController))
)
export default recordRouter
