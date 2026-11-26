import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { categories } from '../data'
import { POPULAR_QUERIES, searchBooks } from '../lib/catalog'
import { BookCard } from '../components/BookCard'

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const [term, setTerm] = useState(query)

  useEffect(() => {
    setTerm(query)
  }, [query])

  const results = searchBooks(query)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = term.trim()
    setParams(next ? { q: next } : {})
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10">
      <h1 className="text-[clamp(2rem,4vw,3rem)]">ค้นหาหนังสือ</h1>

      <form
        onSubmit={submit}
        role="search"
        className="mt-6 flex max-w-[640px] items-center border-b border-ink pb-2"
      >
        <MagnifyingGlass size={20} className="shrink-0 text-ink-mute" aria-hidden="true" />
        <label htmlFor="search-page-input" className="sr-only">
          คำค้น
        </label>
        <input
          id="search-page-input"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="ชื่อหนังสือ ผู้แต่ง หรือหมวด"
          className="ml-3 w-full bg-transparent text-[17px] outline-none placeholder:text-ink-mute"
        />
        <button
          type="submit"
          className="shrink-0 text-[13px] underline decoration-line underline-offset-4 transition-colors hover:text-brick"
        >
          ค้นหา
        </button>
      </form>

      {query ? (
        <>
          <p className="mt-8 text-[13px] text-ink-mute">
            ผลลัพธ์สำหรับ “{query}” {results.length} เล่ม
          </p>

          {results.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 pb-16 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((book) => (
                <BookCard key={book.slug} book={book} />
              ))}
            </div>
          ) : (
            <div className="mt-6 border border-line bg-paper-card px-6 py-14">
              <p className="font-display text-[22px]">ยังไม่พบเล่มที่ตรงกับ “{query}”</p>
              <p className="mt-2 max-w-[48ch] text-[13px] leading-relaxed text-ink-soft">
                ลองใช้คำที่สั้นลง หรือค้นด้วยชื่อผู้แต่งและชื่อภาษาอังกฤษ
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {POPULAR_QUERIES.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => setParams({ q: entry })}
                    className="border border-line px-3 py-1.5 text-[12px] text-ink-soft transition-colors hover:border-ink"
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-12 pb-16 pt-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[13px] text-ink-mute">คำค้นยอดนิยม</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR_QUERIES.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setParams({ q: entry })}
                  className="border border-line px-3 py-1.5 text-[13px] text-ink-soft transition-colors hover:border-ink"
                >
                  {entry}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[13px] text-ink-mute">เลือกตามหมวดหมู่</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex items-baseline justify-between gap-3 border-b border-line py-3 text-[14px] transition-colors hover:text-brick"
                  >
                    {category.label}
                    <span className="text-[10px] tracking-[0.18em] text-ink-mute">
                      {category.labelEn.toUpperCase()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
