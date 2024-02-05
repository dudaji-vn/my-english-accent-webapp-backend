import { Response } from 'express'
import { IResponse } from '../interfaces/common'
function customResponse(res: IResponse): Response {
  // Add a success method
  res.success = function (data: any) {
    return res.status(200).json({
      status: 'success',
      data: data
    })
  }

  // Add an error method
  res.error = function (
    statusCode: number = 500,
    message: string,
    messageDetail: string = ''
  ) {
    return res.status(statusCode || 500).json({
      status: 'error',
      message: message || 'Internal Server Error',
      messageDetail: messageDetail
    })
  }

  // Return the modified response object
  return res
}

export default customResponse
