import { injectable } from 'tsyringe'
import { IRequest, IResponse } from '../interfaces/common'
import RecordService from '../services/record.service'
import { IRecordRequest } from '../interfaces/dto/record.dto'

@injectable()
export default class RecordController {
  constructor(private readonly recordService: RecordService) {}
  async getAllVocabulariesByLectures(req: IRequest, res: IResponse) {
    const { lectureId, stage } = req.query
    const data = await this.recordService.getAllVocabulariesByLectures({
      lectureId: lectureId as any,
      stage: parseInt(stage as any),
      userId: req.user._id
    })
    return res.success(data)
  }
  async addRecord(req: IRequest, res: IResponse) {
    const payload = req.body as IRecordRequest
    payload.userId = req.user._id
    const data = await this.recordService.addRecord(payload)
    return res.success(data)
  }
  async getMyRecordsByLecture(req: IRequest, res: IResponse) {
    const { lectureId } = req.query
    const data = await this.recordService.getMyRecordsByLecture({
      lectureId: lectureId as any,
      userId: req.user._id
    })
    return res.success(data)
  }
}
