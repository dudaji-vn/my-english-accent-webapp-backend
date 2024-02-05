// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import ClubController from '../../controllers/club.controller'
import { catchAsync } from '../../middleware/catch-async.middleware'
import auth from '../../middleware/auth.middleware'
const clubController = container.resolve<ClubController>(ClubController)

const clubRouter = express.Router()

clubRouter.put(
  '/addOrUpdateClub',
  auth,
  catchAsync(clubController.addOrUpdateClub.bind(clubController))
)

clubRouter.get(
  '/getClubsOwner',
  auth,
  catchAsync(clubController.getClubsOwner.bind(clubController))
)

clubRouter.get(
  '/getMembersInfo/:clubId',
  auth,
  catchAsync(clubController.getMembersInfo.bind(clubController))
)
clubRouter.get(
  '/getDetailClub/:clubId',
  auth,
  catchAsync(clubController.getDetailClub.bind(clubController))
)
export default clubRouter
