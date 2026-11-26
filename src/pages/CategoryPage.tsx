import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categories } from '../data'
import { booksInCategory, getCategory } from '../lib/catalog'
import { BookCard } from '../components/BookCard'
import { NotFoundPage } from './NotFoundPage'

const BANDS = [
  { id: 'all', label: 'ทั้งหมด', min: 0, max: Number.POSITIVE_INFINITY },
  { id: 'under300', label: 'ต่ำกว่า 300', min: 0, max: 299 },
  { id: 'mid', label: '300 ถึง 500', min: 300, max: 500 },
  { id: 'over500', label: 'มากกว่า 500', min: 501, max: Number.POSITIVE_INFINITY },
]

type SortId = 'featured' | 'price-asc' | 'price-desc' | 'title'

export function CategoryPage() {
  const { slug } = useParams()
  const category = slug ? getCategory(slug) : undefined
  const [bandId, setBandId] = useState('all')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<SortId>('featured')

  const all = useMemo(() => (slug ? booksInCategory(slug) : []), [slug])

  const visible = useMemo(() => {
    const band = BANDS.find((entry) => entry.id === bandId) ?? BANDS[0]
    const filtered = all
      .filter((book) => book.price >= band.min && book.price <= band.max)
      .filter((book) => (inStockOnly ? book.stock !== 'out' : true))

    const sorted = [...filtered]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'title') sorted.sort((a, b) => a.titleTh.localeCompare(b.titleTh, 'th'))

    return sorted
  }, [all, bandId, inStockOnly, sort])

  if (!category || !slug) return <NotFoundPage />

  const hasFilters = bandId !== 'all' || inStockOnly

  return (
    <section className="mx-auto max-w-[1400px] px-5 md:px-10">
      <div className="border-b border-line py-10 md:py-14">
        <p className="text-[12px] text-ink-mute">
          <Link to="/" className="transition-colors hover:text-brick">
            หน้าแรก
          </Link>
          <span aria-hidden="true"> / </span>
          {category.labelEn}
        </p>
        <h1 className="mt-3 text-[clamp(2.2rem,4.8vw,3.6rem)]">{category.label}</h1>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.9] text-ink-soft">
          {category.blurb}
        </p>
        <p className="mt-2 text-[12px] text-ink-mute">ทั้งหมด {all.length} เล่ม</p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line py-4">
        {categories.map((entry) => (
          <Link
            key={entry.slug}
            to={`/category/${entry.slug}`}
            aria-current={entry.slug === slug ? 'page' : undefined}
            className={`shrink-0 border px-3 py-1.5 text-[13px] transition-colors ${
              entry.slug === slug
                ? 'border-ink bg-ink text-paper-card'
                : 'border-line text-ink-soft hover:border-ink'
            }`}
          >
            {entry.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="กรองตามช่วงราคา">
          {BANDS.map((band) => (
            <button
              key={band.id}
              type="button"
              onClick={() => setBandId(band.id)}
              aria-pressed={bandId === band.id}
              className={`border px-3 py-1.5 text-[13px] transition-colors ${
                bandId === band.id
                  ? 'border-ink bg-ink text-paper-card'
                  : 'border-line text-ink-soft hover:border-ink'
              }`}
            >
              {band.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-soft">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
              className="h-4 w-4 accent-[#a5402c]"
            />
            เฉพาะที่พร้อมส่ง
          </label>

          <label className="flex items-center gap-2 text-[13px] text-ink-soft">
            เรียงตาม
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortId)}
              className="border border-line bg-paper-card px-2 py-1.5 text-[13px]"
            >
              <option value="featured">แนะนำ</option>
              <option value="price-asc">ราคาต่ำไปสูง</option>
              <option value="price-desc">ราคาสูงไปต่ำ</option>
              <option value="title">ชื่อ ก ถึง ฮ</option>
            </select>
          </label>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mb-16 border border-line bg-paper-card px-6 py-16 text-center">
          <p className="font-display text-[24px]">ไม่พบหนังสือที่ตรงกับตัวกรอง</p>
          <p className="mx-auto mt-2 max-w-[42ch] text-[13px] leading-relaxed text-ink-soft">
            ลองขยายช่วงราคา หรือปิดตัวกรองสินค้าพร้อมส่งดูอีกครั้ง
          </p>
          <button
            type="button"
            onClick={() => {
              setBandId('all')
              setInStockOnly(false)
            }}
            className="btn-ghost mt-6"
          >
            ล้างตัวกรอง
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 pb-10 sm:grid-cols-3 xl:grid-cols-4">
            {visible.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-16 pt-4">
            <p className="text-[12px] text-ink-mute">
              แสดง {visible.length} จาก {all.length} เล่ม
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setBandId('all')
                  setInStockOnly(false)
                }}
                className="text-[13px] text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-brick"
              >
                ล้างตัวกรอง
              </button>
            ) : null}
          </div>
        </>
      )}
    </section>
  )
}
