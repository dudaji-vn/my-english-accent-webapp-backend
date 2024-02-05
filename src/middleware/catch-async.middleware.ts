import { NextFunction } from 'express'
import { IRequest, IResponse } from '../interfaces/common'
import { UnAuthorizeError, BadRequestError } from './error.middleware'

type AsyncFunction = (
  req: IRequest,
  res: IResponse,
  next: NextFunction
) => Promise<void>

export const catchAsync = (fn: AsyncFunction) => {
  return (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      fn(req, res, next).catch((err: Error) => {
        console.log({
          messsage: err.message,
          stack: err.stack
        })
        if (err instanceof UnAuthorizeError) {
          return res.error(401, err.message, err.stack)
        }
        if (err instanceof BadRequestError) {
          return res.error(400, err.message, err.stack)
        }
        return res.error(500, err.message, err.stack)
      })
    } catch (err) {
      if (err instanceof Error) {
        return res.error(500, err.message, err.stack)
      }
      return res.error(500, 'Uncaught error')
    }
  }
}
