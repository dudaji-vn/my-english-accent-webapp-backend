// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'

import GoogleController from '../../controllers/google.controller'
import auth from '../../middleware/auth'
import { catchAsync } from '../../middleware/catchAsync'
const googleController = container.resolve<GoogleController>(GoogleController)

const googleRouter = express.Router()

googleRouter.get(
  '/textToSpeak',
  catchAsync(googleController.textToSpeak.bind(googleController))
)
googleRouter.post(
  '/speakToText',
  auth,
  catchAsync(googleController.speakToText.bind(googleController))
)

export default googleRouter
