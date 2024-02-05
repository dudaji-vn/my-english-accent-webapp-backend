// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import GoogleController from '../../controllers/google.controller'
import auth from '../../middleware/auth.middleware'
import { catchAsync } from '../../middleware/catch-async.middleware'
import uploadFile from '../../middleware/upload-file.middleware'
const googleController = container.resolve<GoogleController>(GoogleController)

const googleRouter = express.Router()

googleRouter.get(
  '/textToSpeak',
  auth,
  catchAsync(googleController.textToSpeak.bind(googleController))
)
googleRouter.post(
  '/speakToText',
  auth,
  uploadFile('voiceFile'),
  catchAsync(googleController.speakToText.bind(googleController))
)

export default googleRouter
