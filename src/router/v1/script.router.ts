// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import ScriptController from '../../controllers/script.controller'
import { catchAsync } from '../../middleware/catchAsync'
const scriptController =
  container.resolve<ScriptController>(ScriptController)

const scriptRouter = express.Router()

scriptRouter.get(
  '/initData',
  catchAsync(scriptController.initData.bind(scriptController))
)

export default scriptRouter
