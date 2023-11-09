// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import RecordController from '../../controllers/record.controller'
import auth from '../../middleware/auth'
import { catchAsync } from '../../middleware/catchAsync'
const recordController = container.resolve<RecordController>(RecordController)

const recordRouter = express.Router()

recordRouter.put(
  '/addOrUpdateRecord',
  auth,
  catchAsync(recordController.addOrUpdateRecord.bind(recordController))
)

recordRouter.get(
  '/getMyRecordsByLecture',
  auth,
  catchAsync(recordController.getMyRecordsByLecture.bind(recordController))
)
export default recordRouter
