// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import auth from '../../middleware/auth.middleware'
import { catchAsync } from '../../middleware/catch-async.middleware'
import UserController from '../../controllers/user.controller'
const userController = container.resolve<UserController>(UserController)

const userRouter = express.Router()
userRouter.get(
  '/allUsers',
  auth,
  catchAsync(userController.getAllUser.bind(userController))
)
userRouter.get(
  '/lectures',
  auth,
  catchAsync(userController.getMyPractice.bind(userController))
)
userRouter.put(
  '/addOrUpdateEnrollment',
  auth,
  catchAsync(userController.addOrUpdateEnrollment.bind(userController))
)
userRouter.get(
  '/checkUserCompleteEvent',
  auth,
  catchAsync(userController.checkUserCompleteEvent.bind(userController))
)
userRouter.put(
  '/addOrUpdateGoogleTranscript',
  auth,
  catchAsync(userController.addOrUpdateGoogleTranscript.bind(userController))
)
userRouter.patch(
  '/updateProfile',
  auth,
  catchAsync(userController.updateProfile.bind(userController))
)
userRouter.get(
  '/getUsersRanking',
  auth,
  catchAsync(userController.getUsersRanking.bind(userController))
)
userRouter.get(
  '/getPlaylistByUser',
  auth,
  catchAsync(userController.getPlaylistByUser.bind(userController))
)
userRouter.get(
  '/getPlaylistSummaryByUser',
  auth,
  catchAsync(userController.getPlaylistSummaryByUser.bind(userController))
)
userRouter.patch(
  '/likeOrUnlikePlaylistByUser',
  auth,
  catchAsync(userController.likeOrUnlikePlaylistByUser.bind(userController))
)
userRouter.get(
  '/getSummary',
  auth,
  catchAsync(userController.getSummary.bind(userController))
)
export default userRouter
