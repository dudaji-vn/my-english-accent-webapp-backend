import { injectable } from 'tsyringe'
import fs from 'fs'
import * as fastCsv from 'fast-csv'
import VocabularyModel from '../entities/Vocabulary'

@injectable()
export default class FileService {
  private async parseCsvRow(row: string[], category: string) {
    const [
      wordOrExpression,
      pronunciation,
      textKorean,
      textVietNam,
      example,
      exampleVI,
      exampleKR,
      wordType
    ] = row

    if (
      wordOrExpression &&
      pronunciation &&
      textKorean &&
      textVietNam &&
      example &&
      exampleVI &&
      exampleKR &&
      wordType &&
      wordOrExpression !== 'word/expression'
    ) {
      return {
        text: {
          en: wordOrExpression,
          vi: textVietNam,
          ko: textKorean
        },
        pronunciation,
        example: {
          en: example,
          vi: exampleVI,
          ko: exampleKR
        },
        type: wordType,
        category
      }
    }
    return null
  }

  private async processCsvFile(source: string, category: string) {
    const stream = fs.createReadStream(source)
    const parser = fastCsv.parseStream(stream)
    const listItems: any[] = []

    parser.on('data', async (row: string[]) => {
      const parsedRow = await this.parseCsvRow(row, category)
      if (parsedRow) {
        listItems.push(parsedRow)
      }
    })

    await new Promise((resolve) => {
      parser.on('end', resolve)
    })

    return listItems
  }

  private async insertDataIntoDatabase(data: any[]) {
    try {
      const result = await VocabularyModel.insertMany(data)
      console.log('Documents inserted:', result)
    } catch (err) {
      console.error('Error inserting documents:', err)
    }
  }

  async syncDataFromExcel() {
    await VocabularyModel.deleteMany()
    await this.handleStoreFile(
      './resource/MEA_Voca_General.csv',
      'general'
    )
    await this.handleStoreFile(
      './resource/MEA_Voca_Designer.csv',
      'designer'
    )
    await this.handleStoreFile(
      './resource/MEA_Voca_Develops.csv',
      'developer'
    )
    return 'sync data'
  }

  private async handleStoreFile(source: string, category: string) {
    const generalData = await this.processCsvFile(source, category)
    const sortedData = generalData.sort((a, b) =>
      a.text.en.toLowerCase().localeCompare(b.text.en.toLowerCase())
    )
    await this.insertDataIntoDatabase(sortedData)
  }
}
