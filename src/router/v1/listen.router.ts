// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import ListenController from '../../controllers/listen.controller'

import auth from '../../middleware/auth'
import { catchAsync } from '../../middleware/catchAsync'
const listenController = container.resolve<ListenController>(ListenController)

const listenRouter = express.Router()

listenRouter.put(
  '/createOrUpdatePlaylist',
  auth,
  catchAsync(listenController.createOrUpdatePlaylist.bind(listenController))
)

listenRouter.get(
  '/getPlaylistListen',
  auth,
  catchAsync(listenController.getPlaylistListen.bind(listenController))
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
