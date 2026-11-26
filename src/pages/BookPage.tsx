import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { baht, stockText, stockTone } from '../lib/format'
import { getBook, getCategory, relatedBooks } from '../lib/catalog'
import { useCart } from '../lib/cart'
import { BookCard } from '../components/BookCard'
import { BookCover } from '../components/BookCover'
import { QuantityStepper } from '../components/QuantityStepper'
import { NotFoundPage } from './NotFoundPage'

export function BookPage() {
  const { slug } = useParams()
  const book = slug ? getBook(slug) : undefined
  const [qty, setQty] = useState(1)
  const { add, open } = useCart()

  useEffect(() => {
    setQty(1)
  }, [book?.slug])

  if (!book) return <NotFoundPage />

  const category = getCategory(book.category)
  const related = relatedBooks(book)
  const outOfStock = book.stock === 'out'

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <nav aria-label="เส้นทาง" className="py-6 text-[12px] text-ink-mute">
        <Link to="/" className="transition-colors hover:text-brick">
          หน้าแรก
        </Link>
        <span aria-hidden="true"> / </span>
        <Link
          to={`/category/${book.category}`}
          className="transition-colors hover:text-brick"
        >
          {category?.label}
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{book.titleTh}</span>
      </nav>

      <div className="grid gap-10 pb-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <BookCover
            book={book}
            priority
            className="aspect-[2/3] w-full max-w-[380px]"
          />
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="หมวดย่อย">
            {book.tags.map((tag) => (
              <li
                key={tag}
                className="border border-line px-2.5 py-1 text-[11px] text-ink-soft"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <p className="text-[11px] tracking-[0.18em] text-ink-mute">
            {category?.labelEn.toUpperCase()}
          </p>
          <h1 className="mt-2 text-[clamp(2rem,3.6vw,3.1rem)]">{book.titleTh}</h1>
          <p className="mt-1 font-display text-[16px] italic text-ink-mute">{book.titleEn}</p>
          <p className="mt-3 text-[15px]">{book.author}</p>

          <div className="mt-6 flex items-baseline gap-4">
            <p className="font-display text-[30px] tabular-nums">{baht(book.price)}</p>
            <p className="flex items-center gap-2 text-[12px] text-ink-soft">
              <span
                aria-hidden="true"
                className={`inline-block h-1.5 w-1.5 ${stockTone[book.stock]}`}
              />
              {stockText[book.stock]}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} />
            <button
              type="button"
              onClick={() => {
                add(book.slug, qty)
                open()
              }}
              disabled={outOfStock}
              className="btn-primary min-w-[190px] disabled:cursor-not-allowed disabled:bg-ink-mute"
            >
              {outOfStock ? 'สินค้าหมดชั่วคราว' : 'เพิ่มลงตะกร้า'}
            </button>
          </div>

          <p className="mt-8 max-w-[60ch] text-[15px] leading-[1.95] text-ink-soft">
            {book.blurb}
          </p>

          {book.note ? (
            <div className="mt-8 max-w-[54ch] border-l-2 border-brick pl-4">
              <p className="text-[11px] text-ink-mute">
                บันทึกจากบรรณาธิการ
              </p>
              <p className="mt-1 font-display text-[20px] leading-[1.6]">{book.note}</p>
            </div>
          ) : null}

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6 text-[13px]">
            <div>
              <dt className="text-ink-mute">สำนักพิมพ์</dt>
              <dd className="mt-0.5">{book.publisher}</dd>
            </div>
            <div>
              <dt className="text-ink-mute">ปีพิมพ์ครั้งแรก</dt>
              <dd className="mt-0.5 tabular-nums">{book.year}</dd>
            </div>
            <div>
              <dt className="text-ink-mute">จำนวนหน้า</dt>
              <dd className="mt-0.5 tabular-nums">{book.pages} หน้า</dd>
            </div>
            <div>
              <dt className="text-ink-mute">ISBN</dt>
              <dd className="mt-0.5 tabular-nums">{book.isbn13 ?? 'ไม่มีข้อมูล'}</dd>
            </div>
            <div>
              <dt className="text-ink-mute">หมวดหมู่</dt>
              <dd className="mt-0.5">{category?.label}</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-line py-14">
          <h2 className="text-[clamp(1.5rem,2.6vw,2rem)]">เล่มอื่นในหมวดเดียวกัน</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((entry) => (
              <BookCard key={entry.slug} book={entry} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
