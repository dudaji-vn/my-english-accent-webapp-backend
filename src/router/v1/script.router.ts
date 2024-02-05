// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import ScriptController from '../../controllers/script.controller'
import { catchAsync } from '../../middleware/catch-async.middleware'
const scriptController = container.resolve<ScriptController>(ScriptController)

const scriptRouter = express.Router()

scriptRouter.get(
  '/importData',
  catchAsync(scriptController.importDataFromExcel.bind(scriptController))
)

export default scriptRouter
