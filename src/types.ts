export type Stock = 'in' | 'low' | 'out'

export interface Book {
  id: string
  slug: string
  titleTh: string
  titleEn: string
  author: string
  category: string
  price: number
  pages: number
  year: number
  publisher: string
  tags: string[]
  blurb: string
  note: string | null
  stock: Stock
  isbn13: string | null
  coverId: number | null
  coverIsbn?: string | null
}

export interface Category {
  slug: string
  label: string
  labelEn: string
  blurb: string
}
