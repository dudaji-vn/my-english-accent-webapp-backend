// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import ClubController from '../../controllers/club.controller'
import { catchAsync } from '../../middleware/catchAsync'
import auth from '../../middleware/auth'
const clubController =
  container.resolve<ClubController>(ClubController)

const clubRouter = express.Router()

clubRouter.post(
  '/addOrUpdateClub',
  auth,
  catchAsync(clubController.addOrUpdateClub.bind(clubController))
)

clubRouter.get(
  '/getClubsOwner',
  auth,
  catchAsync(clubController.getClubsOwner.bind(clubController))
)

export default clubRouter
