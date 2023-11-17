export interface IPlaylistRequest {
  userId: string
  favoriteUserIds: string[]
  favoriteLectureIds: string[]
}

export interface IPlaylistSummary {
  favoriteLectureIds: string[]
  favoriteUserIds: string[]
}
export interface IPlaylistListen extends IPlaylistSummary {
  lectureId: string
}
