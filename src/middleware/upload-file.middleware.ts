import { NextFunction } from 'express'
import { IRequest, IResponse } from '../interfaces/common'

import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const uploadFile = (fieldName: string) => {
  return async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      upload.single(fieldName)(req, res, (err: any) => {
        if (err) {
          return res.error(400, 'File upload failed', err.message)
        }

        next()
      })
    } catch (err) {
      if (err instanceof Error) {
        console.log(err)
        return res.error(500, err.message, err.stack)
      }
      return res.error(500, 'Uncaught Error ', '')
    }
  }
}

export default uploadFile
