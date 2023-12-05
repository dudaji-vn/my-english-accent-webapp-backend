import * as fastCsv from 'fast-csv'
import fs from 'fs'
import { injectable } from 'tsyringe'
import LectureModel from '../entities/Lecture'
import VocabularyModel from '../entities/Vocabulary'
import { ICreateVocabularyDAO } from '../interfaces/dao/vocabulary.dao'
import { IVocabularyRow } from '../interfaces/dto/vocabulary.dto'

@injectable()
export default class FileService {
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

  private async processCsvFile(source: string): Promise<IVocabularyRow[]> {
    const stream = fs.createReadStream(source)
    const parser = fastCsv.parseStream(stream)
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

  async importDataFromExcel() {
    const result = await this.handleStoreFile(
      './resource/MEA-Voca-Lecture-50-pattern.csv'
    )

    return result
  }

  private async handleStoreFile(source: string) {
    const vocabulariesData = await this.processCsvFile(source)
    let listLectureName = vocabulariesData.map((item) => item.lectureName)
    const existedLectures = (await LectureModel.find().lean()).map(
      (item) => item.lecture_name
    )
    const needSaveLectures = [...new Set(listLectureName)]
      .filter((lecture) => !existedLectures.includes(lecture))
      .map((item) => {
        return {
          lecture_name: item
        }
      })

    if (needSaveLectures && needSaveLectures.length > 0) {
      await LectureModel.insertMany(needSaveLectures)
    }
    const lectures = await LectureModel.find().lean()

    const existedVocabularies = await VocabularyModel.find().lean()

    const vocabulariesNeedSave: (ICreateVocabularyDAO | undefined)[] =
      vocabulariesData
        .map((voca) => {
          const lectureId = lectures
            .find((lecture) => lecture.lecture_name === voca.lectureName)
            ?._id.toString()

          if (lectureId) {
            return {
              lecture: lectureId,
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
    const vocaImports = await VocabularyModel.insertMany(vocabulariesNeedSave)
    return vocaImports
  }
}
