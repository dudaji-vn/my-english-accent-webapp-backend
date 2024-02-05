// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import ListenController from '../../controllers/listen.controller'

import auth from '../../middleware/auth.middleware'
import { catchAsync } from '../../middleware/catch-async.middleware'
const listenController = container.resolve<ListenController>(ListenController)

const listenRouter = express.Router()

listenRouter.put(
  '/createOrUpdatePlaylist',
  auth,
  catchAsync(listenController.createOrUpdatePlaylist.bind(listenController))
)

listenRouter.get(
  '/getPlaylistSummary',
  auth,
  catchAsync(listenController.getPlaylistSummary.bind(listenController))
)
listenRouter.get(
  '/getPlaylistListenByLecture',
  auth,
  catchAsync(listenController.getPlaylistListenByLecture.bind(listenController))
)
listenRouter.get(
  '/getLecturesAvailable',
  auth,
  catchAsync(listenController.getLecturesAvailable.bind(listenController))
)
listenRouter.get(
  '/getUsersAvailable',
  auth,
  catchAsync(listenController.getUsersAvailable.bind(listenController))
)
export default listenRouter
