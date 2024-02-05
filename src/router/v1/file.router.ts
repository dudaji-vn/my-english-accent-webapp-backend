// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import { catchAsync } from '../../middleware/catch-async.middleware'
import FileController from '../../controllers/file.controller'
const fileController = container.resolve<FileController>(FileController)
import multer from 'multer'
import auth from '../../middleware/auth.middleware'
import uploadFile from '../../middleware/upload-file.middleware'

const fileRouter = express.Router()

fileRouter.put(
  '/uploadLectureAndVocabularyFromCsv',
  auth,
  uploadFile('csvFile'),
  catchAsync(
    fileController.uploadLectureAndVocabularyFromCsv.bind(fileController)
  )
)

export default fileRouter
