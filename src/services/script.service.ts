import { injectable } from 'tsyringe'
import LectureModel from '../entities/Lecture'
import { ILectureDAO } from '../interfaces/dao/lecture.dao'
import { EClass } from '../const/common'
import VocabularyModel from '../entities/Vocabulary'

@injectable()
export default class ScriptService {
  async initData() {
    const lectures: ILectureDAO[] = [
      {
        lecture_name: 'Terminology in IT english',
        class: EClass.Developer,
        img_src:
          'https://cdn-icons-png.flaticon.com/512/3285/3285819.png'
      },
      {
        lecture_name: 'Programming Language',
        class: EClass.Developer,
        img_src:
          'https://cdn-icons-png.flaticon.com/512/2721/2721614.png'
      },
      {
        lecture_name: 'Acronym in IT English',
        class: EClass.Developer,
        img_src:
          'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
      },
      {
        lecture_name: 'Git - advanced 1',
        class: EClass.Developer,
        img_src:
          'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
      },
      {
        lecture_name: 'Code review 1',
        class: EClass.Developer,
        img_src:
          'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
      },
      {
        lecture_name: 'Code review 2',
        class: EClass.Developer,
        img_src:
          'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
      },
      {
        lecture_name: 'Git - Basic 1',
        class: EClass.Developer,
        img_src:
          'https://cdn-icons-png.flaticon.com/512/10816/10816474.png'
      }
    ]

    for (const lecture of lectures) {
      await LectureModel.findOneAndUpdate(
        { lecture_name: lecture.lecture_name },
        lecture,
        { upsert: true }
      )
    }
    const vocabularies = [
      {
        class: 0,
        lecture: '6540bd721860dada50828c4d',
        phonetic_display_language: `/ˈɛksɪˌkjut ðə ˈproʊˌɡræm ənd si ðə rɪˈzʌlt/`,
        title_display_language:
          'Execute the program and see the result.'
      },
      {
        class: 0,
        lecture: '6540bd721860dada50828cad',
        phonetic_display_language: `/diː-ɛn-ɛs - dəʊˈmeɪn neɪm ˈsɪstəm/`,
        title_display_language: 'DNS - Domain Name System'
      },
      {
        class: 0,
        lecture: '6540bd721860dada50828c4d',
        phonetic_display_language: `/ˌriːjuːzəˈbɪləti ɪz wʌn ʌv ðə ki ˈfæktərz ɪn dɪˈzaɪnɪŋ greɪt kəmˈpoʊnənts/`,
        title_display_language:
          'Reusability is one of the key factors in designing great components.'
      },
      {
        class: 1,
        lecture: '6540bd721860dada50828cad',
        phonetic_display_language: `/ˌriːjuːzəˈbɪləti ɪz wʌn ʌv ðə ki ˈfæktərz ɪn dɪˈzaɪnɪŋ greɪt kəmˈpoʊnənts/`,
        title_display_language: 'Test'
      }
    ]

    for (const item of vocabularies) {
      await VocabularyModel.findOneAndUpdate(
        { title_display_language: item.title_display_language },
        item,
        { upsert: true }
      )
    }

    return 'Init data'
  }
}
