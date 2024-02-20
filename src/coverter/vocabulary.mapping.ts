import { SentenceStatus } from '../const/common'
import { IVocabularyDAO } from '../interfaces/dao/vocabulary.dao'
import { IRecordDTO } from '../interfaces/dto/record.dto'
import { IUserDTO } from '../interfaces/dto/user.dto'
import {
  INativeVocabularyDTO,
  IRecorded,
  IVocabularyDTO,
  Language
} from '../interfaces/dto/vocabulary.dto'

export function convertToVocabularyDTO(voca: IVocabularyDAO): IVocabularyDTO {
  return {
    vocabularyId: voca._id,
    vCreated: voca.created,
    vUpdated: voca.updated,
    vphoneticDisplayLanguage: voca.phonetic_display_language,
    vtitleDisplayLanguage: voca.title_display_language,
    lectureId: voca.lecture,
    numberOrder: voca.number_order
  }
}

export function convertToVocabularyWithTranslateDTO(
  voca: IVocabularyDAO,
  nativeLanguage: Language
): IVocabularyDTO & INativeVocabularyDTO {
  return {
    vocabularyId: voca._id,
    vCreated: voca.created,
    vUpdated: voca.updated,
    vphoneticDisplayLanguage: voca.phonetic_display_language,
    vtitleDisplayLanguage: voca.title_display_language,
    lectureId: voca.lecture,
    numberOrder: voca.number_order,
    language: nativeLanguage,
    titleNativeLanguage:
      nativeLanguage === 'kr'
        ? voca?.text_translate?.kr
        : voca?.text_translate?.vn
  }
}

export function convertToVocabularyWithRecordedDTO(
  item: any,
  nativeLanguage?: Language
): IVocabularyDTO & INativeVocabularyDTO & IRecorded {
  return {
    vocabularyId: item.vocabulary._id,
    vCreated: item.vocabulary.created,
    vUpdated: item.vocabulary.updated,
    vphoneticDisplayLanguage: item.vocabulary.phonetic_display_language,
    vtitleDisplayLanguage: item.vocabulary.title_display_language,
    lectureId: item.vocabulary.lecture,
    language: nativeLanguage ?? 'vn',
    titleNativeLanguage:
      nativeLanguage === 'kr'
        ? item?.vocabulary?.text_translate?.kr
        : item?.vocabulary?.text_translate?.vn,
    voiceSrc: item?.vocabulary.voice_src ?? '',
    recordId: item?.vocabulary.record_id ?? '',
    finalTranscript: item?.vocabulary?.final_transcript ?? '',
    numberOrder: item?.vocabulary?.number_order,
    status:
      item.vocabulary?.score === 1
        ? SentenceStatus.Pass
        : item?.vocabulary.record_id
        ? SentenceStatus.NotPass
        : SentenceStatus.NotRecord,

    score: item?.vocabulary?.score
  }
}

export function convertToDetailVocabularyByLecture(item: any) {
  return {
    textVN: item?.text_translate?.vn,
    textKR: item?.text_translate?.kr,
    vocabularyId: item._id,
    numberOrder: item.number_order ?? 0,
    lectureName: item?.lecture?.lecture_name,
    titleDisplay: item.title_display_language,
    phonetic: item.phonetic_display_language
  }
}

export function convertToRecordOfUser(
  item: any
): Omit<IUserDTO & IRecordDTO, 'email'> {
  return {
    avatarUrl: item.user.avatar_url,
    challengeId: item.challenge,
    displayLanguage: item.user.display_language,
    nativeLanguage: item.user.native_language,
    nickName: item.user.nick_name,
    rCreated: item.created,
    recordId: item._id,
    rUpdated: item.updated,
    voiceSrc: item.voice_src,
    userId: item.user._id,
    vocabularyId: item.vocabulary
  }
}
