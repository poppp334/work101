import { books, categories } from '../data'
import type { Book, Category } from '../types'

export const getBook = (slug: string): Book | undefined => books.find((b) => b.slug === slug)

export const getCategory = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug)

export const booksInCategory = (slug: string): Book[] => books.filter((b) => b.category === slug)

export const countInCategory = (slug: string): number => booksInCategory(slug).length

export const relatedBooks = (book: Book, limit = 4): Book[] =>
  books.filter((b) => b.category === book.category && b.slug !== book.slug).slice(0, limit)

const STAFF_PICK_SLUGS = [
  'the-remains-of-the-day',
  'ways-of-seeing',
  'attack-on-titan-vol-1',
  'time-is-a-mother',
  'the-little-prince',
]

const NEW_ARRIVAL_SLUGS = [
  'time-is-a-mother',
  'the-anthropocene-reviewed',
  'chainsaw-man-vol-1',
  'braiding-sweetgrass',
  'devotions',
  'educated',
  'atomic-habits',
  'nana-vol-1',
  'sapiens',
  'matilda',
  'the-prophet',
  'one-piece-vol-1',
]

const pick = (slugs: string[]): Book[] =>
  slugs
    .map((slug) => getBook(slug))
    .filter((book): book is Book => Boolean(book))

export const staffPicks = (): Book[] => pick(STAFF_PICK_SLUGS)
export const newArrivals = (): Book[] => pick(NEW_ARRIVAL_SLUGS)

export function coverUrl(book: Book): string {
  return `${import.meta.env.BASE_URL}covers/${book.slug}.jpg`
}

const normalize = (value: string): string => value.toLowerCase().replace(/\s+/g, ' ').trim()

const CATEGORY_TEXT = new Map(
  categories.map((category) => [category.slug, `${category.label} ${category.labelEn}`]),
)

export function searchBooks(query: string): Book[] {
  const needle = normalize(query)
  if (needle.length === 0) return []

  const scored: { book: Book; score: number }[] = []

  for (const book of books) {
    const titleTh = normalize(book.titleTh)
    const titleEn = normalize(book.titleEn)
    const author = normalize(book.author)
    const category = normalize(CATEGORY_TEXT.get(book.category) ?? '')
    const rest = normalize([book.publisher, book.tags.join(' ')].join(' '))

    let score = 0
    if (titleTh.startsWith(needle)) score += 4
    if (titleEn.startsWith(needle)) score += 3
    if (titleTh.includes(needle)) score += 2
    if (titleEn.includes(needle)) score += 1
    if (author.includes(needle)) score += 2
    if (category.includes(needle)) score += 3
    if (rest.includes(needle)) score += 1

    if (score > 0) scored.push({ book, score })
  }

  return scored.sort((a, b) => b.score - a.score).map((entry) => entry.book)
}

export const POPULAR_QUERIES = ['มังงะ', 'กวีนิพนธ์', 'Harari', 'Murakami', 'หนังสือเด็ก']
