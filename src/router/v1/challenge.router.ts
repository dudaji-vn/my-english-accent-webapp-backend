// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import ChallengeController from '../../controllers/challenge.controller'
import auth from '../../middleware/auth.middleware'
import { catchAsync } from '../../middleware/catch-async.middleware'
const challengeController =
  container.resolve<ChallengeController>(ChallengeController)

const challengeRouter = express.Router()

challengeRouter.get(
  '/getChallengesInClub/:clubId',
  auth,
  catchAsync(challengeController.getChallengesInClub.bind(challengeController))
)

challengeRouter.get(
  '/getChallengeDetailInClub/:challengeId',
  auth,
  catchAsync(
    challengeController.getChallengeDetailInClub.bind(challengeController)
  )
)

challengeRouter.patch(
  '/updateChallengeMember/:challengeId',
  auth,
  catchAsync(
    challengeController.updateChallengeMember.bind(challengeController)
  )
)
challengeRouter.get(
  '/getRecordToListenByChallenge/:challengeId',
  auth,
  catchAsync(
    challengeController.getRecordToListenByChallenge.bind(challengeController)
  )
)

challengeRouter.get(
  '/getAllRecordByChallenge/:challengeId',
  auth,
  catchAsync(
    challengeController.getAllRecordInChallenge.bind(challengeController)
  )
)

export default challengeRouter
