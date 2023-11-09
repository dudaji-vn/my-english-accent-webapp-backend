// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import VocabularyController from '../../controllers/vocabulary.controller'
import auth from '../../middleware/auth'
import { catchAsync } from '../../middleware/catchAsync'
const vocabularyController =
  container.resolve<VocabularyController>(VocabularyController)

const vocabularyRouter = express.Router()

vocabularyRouter.get(
  '/getVocabularyById/:vocabularyId',
  auth,
  catchAsync(vocabularyController.getVocabularyById.bind(vocabularyController))
)
vocabularyRouter.get(
  '/getAllVocabulariesByLecture',
  auth,
  catchAsync(
    vocabularyController.getAllVocabulariesByLectures.bind(vocabularyController)
  )
)
vocabularyRouter.get(
  '/getAllVocabulariesByLectureId',
  catchAsync(
    vocabularyController.getAllVocabularyByLectureId.bind(vocabularyController)
  )
)

export default vocabularyRouter
