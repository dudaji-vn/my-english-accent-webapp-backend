// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import ChallengeController from '../../controllers/challenge.controller'
import auth from '../../middleware/auth'
import { catchAsync } from '../../middleware/catchAsync'
const challengeController =
  container.resolve<ChallengeController>(ChallengeController)

const challengeRouter = express.Router()

challengeRouter.get(
  '/getChallengesInClub/:clubId',
  auth,
  catchAsync(challengeController.getChallengesInClub.bind(challengeController))
)

export default challengeRouter
