import type { Book, Category } from '../types'
import booksJson from './books.json'
import categoriesJson from './categories.json'

export const books = booksJson as unknown as Book[]
export const categories = categoriesJson as unknown as Category[]
