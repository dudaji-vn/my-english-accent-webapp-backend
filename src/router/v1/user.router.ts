// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import auth from '../../middleware/auth'
import { catchAsync } from '../../middleware/catchAsync'
import UserController from '../../controllers/user.controller'
import { catchAsync } from '../../middleware/catchAsync'
const userController = container.resolve<UserController>(UserController)

const userRouter = express.Router()

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

export default userRouter
