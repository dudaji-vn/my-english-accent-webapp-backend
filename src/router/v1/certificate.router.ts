// @ts-nocheck
import express from 'express'
import { container } from 'tsyringe'
import { catchAsync } from '../../middleware/catchAsync'
import auth from '../../middleware/auth'
import CertificateController from '../../controllers/certificate.controler'
const certificateController = container.resolve<CertificateController>(
  CertificateController
)

const certificateRouter = express.Router()
certificateRouter.get(
  '/isArchived',
  auth,
  catchAsync(certificateController.isArchived.bind(certificateController))
)
certificateRouter.get(
  '/progress',
  auth,
  catchAsync(certificateController.getProgress.bind(certificateController))
)
certificateRouter.get(
  '/getContentById',
  auth,
  catchAsync(certificateController.getContentById.bind(certificateController))
)
certificateRouter.put(
  '/addOrUpdateUserContentCertificate',
  auth,
  catchAsync(
    certificateController.addOrUpdateUserContentCertificate.bind(
      certificateController
    )
  )
)
certificateRouter.post(
  '/addCertificate',

  catchAsync(certificateController.addCertificate.bind(certificateController))
)
certificateRouter.get(
  '/getUserCertificate',
  auth,
  catchAsync(
    certificateController.getUserCertificate.bind(certificateController)
  )
)

certificateRouter.get(
  '/getUserRecordsCertificate',
  catchAsync(
    certificateController.getUserRecordsCertificate.bind(certificateController)
  )
)

certificateRouter.post(
  '/getListVocabularyId',
  catchAsync(
    certificateController.getListVocabularyId.bind(certificateController)
  )
)
export default certificateRouter
