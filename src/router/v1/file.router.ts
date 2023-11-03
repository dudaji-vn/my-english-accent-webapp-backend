// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import FileController from '../../controllers/file.controller'
import { catchAsync } from '../../middleware/catchAsync'
const fileController =
  container.resolve<FileController>(FileController)

const fileRouter = express.Router()

fileRouter.get(
  '/syncData',
  catchAsync(fileController.syncDataFromExcel.bind(fileController))
)

export default fileRouter
