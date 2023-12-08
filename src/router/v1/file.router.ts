// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'

import { catchAsync } from '../../middleware/catchAsync'
import FileController from '../../controllers/file.controller'
const fileController = container.resolve<FileController>(FileController)
import multer from 'multer'
import auth from '../../middleware/auth'
import uploadFile from '../../middleware/uploadFile'

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
