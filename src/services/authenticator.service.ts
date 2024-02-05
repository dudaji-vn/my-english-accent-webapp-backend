import { injectable } from 'tsyringe'

import { OAuth2Client } from 'google-auth-library'
import { UnAuthorizeError } from '../middleware/error.middleware'
@injectable()
export default class AuthenticatorService {
  googleClient
  constructor() {
    this.googleClient = new OAuth2Client()
  }
  async googleVerify(token: string) {
    const ticket = await this.googleClient
      .verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      .catch((err) => {
        throw new UnAuthorizeError('Token is invalid')
      })
    const payload = ticket.getPayload()
    if (payload) {
      return true
    }
    return false
  }
}
