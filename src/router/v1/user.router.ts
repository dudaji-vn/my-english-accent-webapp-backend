// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import auth from '../../middleware/auth'
import { catchAsync } from '../../middleware/catchAsync'
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

export default userRouter
