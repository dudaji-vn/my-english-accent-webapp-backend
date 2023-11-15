// @ts-nocheck
import { log } from 'console'
import { convertToUserDTO } from '../coverter/user.mapping'
import LectureModel from '../entities/Lecture'
import RecordModel from '../entities/Record'
import UserModel from '../entities/User'
import VocabularyModel from '../entities/Vocabulary'
import { IPlaylistListen, IPlaylistRequest } from '../interfaces/dto/listen.dto'

export class ListenService {
  async createOrUpdatePlaylist(payload: IPlaylistRequest) {
    console.log(payload)
    const { favoriteLectureIds, favoriteUserIds, userId } = payload

    if (favoriteLectureIds && favoriteLectureIds.length > 0) {
      await UserModel.findByIdAndUpdate(
        userId,
        { favorite_lecture_ids: favoriteLectureIds },
        { new: true }
      )
    }
    if (favoriteUserIds && favoriteUserIds.length > 0) {
      await UserModel.findByIdAndUpdate(
        userId,
        { favorite_user_ids: favoriteUserIds },
        { new: true }
      )
    }
    return true
  }
  async getPlaylistListen(payload: IPlaylistListen) {
    const { favoriteLectureIds, favoriteUserIds, lectureId } = payload

    const lectures = await LectureModel.find({
      _id: { $in: favoriteLectureIds }
    })
    const users = await UserModel.find({ _id: { $in: favoriteUserIds } })

    return {
      lectureIds: [],
      peoples: [],
      vocabularies: []
    }
  }
  async getLecturesAvailable() {
    const aggQuery = [
      {
        $lookup: {
          from: 'lectures',
          localField: 'lecture',
          foreignField: '_id',
          as: 'lectureInfo'
        }
      },
      {
        $unwind: '$lectureInfo'
      },
      {
        $group: {
          _id: {
            lectureId: '$lectureInfo._id',
            lectureName: '$lectureInfo.lecture_name'
          },
          vocabularies: { $push: '$$ROOT' },
          totalVocabularies: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          lectureId: '$_id.lectureId',
          lectureName: '$_id.lectureName',
          vocabularies: 1,
          totalVocabularies: 1
        }
      }
    ]
    const data = await VocabularyModel.aggregate(aggQuery)
    const records = await RecordModel.find({ challenge: null })

    return data
      .map((item) => {
        let totalPeople = 0
        const listVocaIds = item.vocabularies.map((voca: any) =>
          voca._id.toString()
        )
        const recordsByLectures = records.filter((record) =>
          listVocaIds.includes(record?.vocabulary?.toString())
        )
        let usersRecorded = {}
        recordsByLectures.forEach((item) => {
          if (!usersRecorded[item.user._id]) {
            usersRecorded[item.user._id] = 1
          } else {
            usersRecorded[item.user._id] += 1
          }
        })
        for (const i in usersRecorded) {
          if (
            usersRecorded.hasOwnProperty(i) &&
            usersRecorded[i] === item.totalVocabularies
          ) {
            totalPeople += 1
          }
        }

        return {
          totalPeople: totalPeople,
          totalVocabularies: item.totalVocabularies,
          lectureId: item.lectureId,
          lectureName: item.lectureName
        }
      })
      .filter((item) => item.totalPeople > 0)
  }
  async getUsersAvailable() {
    const aggQuery = [
      {
        $lookup: {
          from: 'vocabularies',
          localField: '_id',
          foreignField: 'lecture',
          as: 'vocabularies'
        }
      },

      {
        $lookup: {
          from: 'records',
          localField: 'vocabularies._id',
          foreignField: 'vocabulary',
          as: 'records'
        }
      }
    ]
    const data = await (
      await LectureModel.aggregate(aggQuery)
    ).filter((item) => item.vocabularies.length > 0)
    let userIds = []
    data.forEach((item) => {
      let allVocaIds = item.vocabularies.map((voca) => voca._id.toString())
      let vocaLength = allVocaIds.length

      let temps = {}
      item.records
        .filter((item) => !item.challenge)
        .forEach((record) => {
          let total = 0

          if (!temps[record.user]) {
            temps[record.user] = 1
          } else {
            temps[record.user] += 1
          }
        })

      console.log(temps)
      for (const i in temps) {
        if (temps.hasOwnProperty(i) && temps[i] === vocaLength) {
          userIds.push(i)
        }
      }
    })
    userIds = [...new Set(userIds)]
    const users = await UserModel.find({ _id: { $in: userIds } })
    return users.map((user) => convertToUserDTO(user))
  }
  async getSelectedLectures() {}
}
