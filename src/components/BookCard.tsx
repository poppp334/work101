import { Link } from 'react-router-dom'
import { baht } from '../lib/format'
import type { Book } from '../types'
import { BookCover } from './BookCover'

interface BookCardProps {
  book: Book
  priority?: boolean
}

export function BookCard({ book, priority = false }: BookCardProps) {
  return (
    <Link to={`/book/${book.slug}`} className="group block">
      <BookCover
        book={book}
        priority={priority}
        className="aspect-[2/3] w-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
      />
      <h3 className="mt-3 font-display text-[18px] leading-[1.35] transition-colors group-hover:text-brick">
        {book.titleTh}
      </h3>
      <p className="mt-0.5 text-[12px] leading-relaxed text-ink-mute">{book.author}</p>
      <p className="mt-1 text-[14px] tabular-nums">{baht(book.price)}</p>
    </Link>
  )
}
