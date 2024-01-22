export interface ICertificateDAO {
  _id: string
  name: string
  img_url: string
  archived_img_url: string
  total_score: number

  contents: {
    order: number
    vocabulary: {
      _id: string
      phonetic_display_language: string
      title_display_language: string
      text_translate: {
        vn: string
        kr: string
      }
    }
  }[]
}
