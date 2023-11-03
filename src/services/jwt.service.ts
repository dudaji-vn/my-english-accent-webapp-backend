import { injectable } from 'tsyringe'
//const jwt = require('jsonwebtoken')
import jwt from 'jsonwebtoken'
@injectable()
export default class JwtService {
  generateAccessToken(payload: string | Buffer | object): string {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET
    if (!tokenSecret) {
      throw new Error('Cannot find tokenSecret')
    }
    return jwt.sign(payload, tokenSecret, {
      algorithm: 'HS256',
      expiresIn: '30d'
    })
  }
}
