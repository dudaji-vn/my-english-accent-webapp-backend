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
  '/progress',
  auth,
  catchAsync(certificateController.getProgress.bind(certificateController))
)

certificateRouter.put(
  '/addContent',

  catchAsync(certificateController.addContent.bind(certificateController))
)
certificateRouter.post(
  '/addCertificate',
  catchAsync(certificateController.addCertificate.bind(certificateController))
)
export default certificateRouter
