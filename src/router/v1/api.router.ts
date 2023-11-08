import express from 'express'
import { PATH } from '../../const/path'
import authRouter from './auth.router'
import fileRouter from './file.router'
import userRouter from './user.router'
import scriptRouter from './script.router'
import clubRouter from './club.router'
import lectureRouter from './lecture.router'
import challengeRouter from './challenge.router'
import recordRouter from './record.router'
import vocabularyRouter from './vocabulary.router'

const apiRouterV1 = express.Router()

const listApi = [
  {
    path: PATH.auth,
    router: authRouter
  },
  {
    path: PATH.user,
    router: userRouter
  },
  {
    path: PATH.file,
    router: fileRouter
  },
  {
    path: PATH.club,
    router: clubRouter
  },
  {
    path: PATH.script,
    router: scriptRouter
  },
  {
    path: PATH.lecture,
    router: lectureRouter
  },
  {
    path: PATH.challenge,
    router: challengeRouter
  },
  {
    path: PATH.record,
    router: recordRouter
  },
  {
    path: PATH.vocabulary,
    router: vocabularyRouter
  }
]
listApi.forEach((item) => {
  apiRouterV1.use(item.path, item.router)
})

export default apiRouterV1
