import { useState } from 'react'
import { coverUrl } from '../lib/catalog'
import type { Book } from '../types'

const JACKETS = [
  { bg: '#4f5b44', fg: '#f3efe4', rule: 'rgba(243, 239, 228, 0.42)' },
  { bg: '#a5402c', fg: '#f7f1e2', rule: 'rgba(247, 241, 226, 0.42)' },
  { bg: '#26251f', fg: '#e9e2cf', rule: 'rgba(233, 226, 207, 0.35)' },
  { bg: '#8a3323', fg: '#f4ebd9', rule: 'rgba(244, 235, 217, 0.4)' },
  { bg: '#333b2a', fg: '#e9e2cf', rule: 'rgba(233, 226, 207, 0.35)' },
  { bg: '#5c6650', fg: '#f4efe2', rule: 'rgba(244, 239, 226, 0.4)' },
]

const hash = (value: string): number => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) % 100000
  }
  return h
}

function HouseJacket({ book }: { book: Book }) {
  const jacket = JACKETS[hash(book.slug) % JACKETS.length]

  return (
    <div
      className="relative flex h-full w-full flex-col p-[8%]"
      style={{ backgroundColor: jacket.bg, color: jacket.fg, containerType: 'inline-size' }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-[4%] border"
        style={{ borderColor: jacket.rule }}
      />

      <div className="relative flex items-start justify-between text-[clamp(5px,2.9cqw,10px)] tracking-[0.2em]">
        <span>กระดาษพับ</span>
        <span>PAPERFOLD</span>
      </div>

      <div className="relative mt-auto pb-[5%]">
        <p className="line-clamp-4 text-balance font-display text-[clamp(13px,11cqw,44px)] leading-[1.14]">
          {book.titleTh}
        </p>
        <p
          className="mt-[0.75em] text-[clamp(6px,3.4cqw,12px)] tracking-[0.05em]"
          style={{ opacity: 0.82 }}
        >
          {book.author}
        </p>
      </div>

      <div
        className="relative flex items-end justify-between gap-3 border-t pt-[5%] text-[clamp(4.5px,2.6cqw,9px)]"
        style={{ borderColor: jacket.rule }}
      >
        <span style={{ opacity: 0.8 }}>ฉบับของร้าน</span>
        <span className="line-clamp-1 text-right" style={{ opacity: 0.65 }}>
          {book.titleEn}
        </span>
      </div>
    </div>
  )
}

interface BookCoverProps {
  book: Book
  priority?: boolean
  className?: string
}

export function BookCover({ book, priority = false, className = '' }: BookCoverProps) {
  const [failed, setFailed] = useState(false)
  const src = coverUrl(book)

  return (
    <div className={`relative overflow-hidden bg-paper-deep cover-shadow ${className}`}>
      <div className="absolute inset-0" aria-hidden="true">
        <HouseJacket book={book} />
      </div>
      {failed ? null : (
        <img
          src={src}
          alt={`ปกหนังสือ ${book.titleTh}`}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailed(true)}
          className="relative h-full w-full object-cover"
        />
      )}
      <span aria-hidden="true" className="cover-spine" />
    </div>
  )
}
