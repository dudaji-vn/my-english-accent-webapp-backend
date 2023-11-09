// @ts-nocheck
import AuthController from '../../controllers/auth.controller'
import { catchAsync } from '../../middleware/catchAsync'
import { container } from 'tsyringe'
import express from 'express'
import auth from '../../middleware/auth'
const authController = container.resolve<AuthController>(AuthController)
const authRouter = express.Router()
authRouter.post(
  '/register',
  catchAsync(authController.register.bind(authController))
)
authRouter.post('/login', catchAsync(authController.login.bind(authController)))
authRouter.post(
  '/adminRegister',
  catchAsync(authController.adminRegister.bind(authController))
)
authRouter.post(
  '/adminLogin',
  catchAsync(authController.adminLogin.bind(authController))
)
authRouter.get(
  '/profile',
  auth,
  catchAsync(authController.getProfile.bind(authController))
)
export default authRouter
