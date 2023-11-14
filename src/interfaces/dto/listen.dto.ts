export interface IPlaylistRequest {
  userId: string
  favoriteUserIds: string[]
  favoriteLectureIds: string[]
}

export interface IPlaylistListen {
  favoriteLectureIds: string[]
  favoriteUserIds: string[]
  lectureId: string
}
