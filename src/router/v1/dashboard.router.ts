// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'

import { catchAsync } from '../../middleware/catchAsync'
import DashboardController from '../../controllers/dashboard.controller'
const dashboardController =
  container.resolve<DashboardController>(DashboardController)

import auth from '../../middleware/auth'

const dashboardRouter = express.Router()

dashboardRouter.get(
  '/analyst',
  auth,
  catchAsync(dashboardController.getAnalyst.bind(dashboardController))
)
dashboardRouter.get(
  '/getTopUserCompleteLecture',

  catchAsync(
    dashboardController.getTopUserCompleteLecture.bind(dashboardController)
  )
)
dashboardRouter.get(
  '/getTop5Lectures',
  catchAsync(dashboardController.getTop5Lectures.bind(dashboardController))
)
dashboardRouter.get(
  '/syncData',
  catchAsync(dashboardController.syncData.bind(dashboardController))
)

export default dashboardRouter
