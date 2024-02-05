import * as fastCsv from 'fast-csv'
import { CsvParserStream, ParserRow } from 'fast-csv'
import fs from 'fs'
import { ClientSession, startSession } from 'mongoose'
import { injectable } from 'tsyringe'
import LectureModel from '../entities/lecture.entity'
import VocabularyModel from '../entities/vocabulary.entity'
import { ICreateVocabularyDAO } from '../interfaces/dao/vocabulary.dao'
import { IVocabularyRow } from '../interfaces/dto/vocabulary.dto'
import { BadRequestError } from '../middleware/error.middleware'

@injectable()
export default class FileService {
  async importDataFromScript() {
    const source = './resource/MEA-Voca-Workplace-Sentences.csv'

    const stream = fs.createReadStream(source)
    const parser = fastCsv.parseStream(stream)
    const session = await startSession()
    session.startTransaction()
    try {
      const result = await this.handleStoreFile(parser, session)
      return result
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      throw err
    }
  }
  async uploadLectureAndVocabularyFromCsv(file: Express.Multer.File) {
    const csvData = file.buffer.toString('utf8')
    const parser = fastCsv.parseString(csvData)
    const session = await startSession()
    session.startTransaction()

    try {
      const result = await this.handleStoreFile(parser, session)
      return result
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      throw err
    }
  }
  private async parseCsvRow(
    row: string[]
  ): Promise<IVocabularyRow | undefined> {
    const [
      numberOrder,
      lectureName,
      wordOrExpression,
      phonetic,
      textKorean,
      textVietNam
    ] = row

    if (
      parseInt(numberOrder) > 0 &&
      lectureName &&
      wordOrExpression &&
      textKorean &&
      textVietNam &&
      phonetic
    ) {
      return {
        numberOrder: parseInt(numberOrder),
        textTranslate: {
          vn: textVietNam,
          kr: textKorean
        },
        titleDisplayLanguage: wordOrExpression,
        lectureName: lectureName,
        phonetic: phonetic
      }
    }
  }

  private async processCsvFile(
    parser: CsvParserStream<ParserRow<any>, ParserRow<any>>
  ): Promise<IVocabularyRow[]> {
    const listItems: IVocabularyRow[] = []

    parser.on('data', async (row: string[]) => {
      const parsedRow = await this.parseCsvRow(row)
      if (parsedRow) {
        listItems.push(parsedRow)
      }
    })

    await new Promise((resolve) => {
      parser.on('end', resolve)
    })

    return listItems
  }

  private async handleStoreFile(
    parser: CsvParserStream<ParserRow<any>, ParserRow<any>>,
    session: ClientSession
  ) {
    const opts = { session }
    const vocabulariesData = await this.processCsvFile(parser)
    let listLectureName = [
      ...new Set(vocabulariesData.map((item) => item.lectureName))
    ]
    const existedLectures = await LectureModel.find({
      lecture_name: { $in: listLectureName }
    }).select('lecture_name')

    if (existedLectures.length > 0) {
      throw new BadRequestError(
        `Exist some lecture have created, you should update lecture from page ;${JSON.stringify(
          existedLectures.map((item) => item.lecture_name)
        )}`
      )
    }

    const needSaveLectures = listLectureName.map((item) => {
      return {
        lecture_name: item
      }
    })

    if (needSaveLectures && needSaveLectures.length > 0) {
      await LectureModel.insertMany(needSaveLectures, opts)
    }
    const lectures = await LectureModel.find().session(session).lean()

    const existedVocabularies = await VocabularyModel.find().lean()

    const vocabulariesNeedSave: (ICreateVocabularyDAO | undefined)[] =
      vocabulariesData
        .map((voca) => {
          const lecture = lectures.find(
            (lecture) => lecture.lecture_name === voca.lectureName
          )

          if (lecture) {
            return {
              lecture: lecture._id.toString(),
              lectureName: lecture.lecture_name,
              phonetic_display_language: voca.phonetic,
              text_translate: voca.textTranslate,
              title_display_language: voca.titleDisplayLanguage,
              number_order: voca.numberOrder
            }
          }
        })
        .filter(
          (item) =>
            item?.lecture &&
            item.number_order &&
            item.phonetic_display_language &&
            item.text_translate &&
            item.title_display_language
        )
        .filter(
          (item) =>
            !existedVocabularies.find(
              (voca) =>
                voca.title_display_language === item?.title_display_language &&
                voca?.lecture?.toString() === item.lecture
            )
        )

    const uniqueKeySet = new Set()
    const listWrongOrder: string[] = []

    vocabulariesNeedSave.forEach((item) => {
      const key = `${item?.number_order}_${item?.lecture}`
      if (uniqueKeySet.has(key)) {
        item?.lectureName && listWrongOrder.push(item.lectureName)
      } else {
        uniqueKeySet.add(key)
      }
    })

    if (listWrongOrder.length > 0) {
      throw new BadRequestError(
        `Duplicate number order on lectures: ;${JSON.stringify(listWrongOrder)}`
      )
    }

    const vocaImports = await VocabularyModel.insertMany(
      vocabulariesNeedSave,
      opts
    )
    await session.commitTransaction()
    session.endSession()
    return vocaImports
  }
}
