// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'

import { catchAsync } from '../../middleware/catch-async.middleware'
import DashboardController from '../../controllers/dashboard.controller'
const dashboardController =
  container.resolve<DashboardController>(DashboardController)

import auth from '../../middleware/auth.middleware'

const dashboardRouter = express.Router()

dashboardRouter.get(
  '/analyst',
  auth,
  catchAsync(dashboardController.getAnalyst.bind(dashboardController))
)
dashboardRouter.get(
  '/getTopUserCompleteLecture',
  auth,
  catchAsync(
    dashboardController.getTopUserCompleteLecture.bind(dashboardController)
  )
)
dashboardRouter.get(
  '/getTop5Lectures',
  auth,
  catchAsync(dashboardController.getTop5Lectures.bind(dashboardController))
)
dashboardRouter.get(
  '/syncData',
  auth,
  catchAsync(dashboardController.syncData.bind(dashboardController))
)
dashboardRouter.get(
  '/getStatisticsScore',
  auth,
  catchAsync(dashboardController.getStatisticsScore.bind(dashboardController))
)

export default dashboardRouter
