import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@phosphor-icons/react'
import { categories } from '../data'
import { countInCategory, newArrivals, staffPicks } from '../lib/catalog'
import { baht } from '../lib/format'
import { BookCard } from '../components/BookCard'
import { BookCover } from '../components/BookCover'

const HERO_LAYOUT = [
  'left-[0%] top-[14%] w-[33%] -rotate-[7deg] z-20',
  'left-[23%] top-[1%] w-[38%] rotate-[2deg] z-10',
  'left-[47%] top-[17%] w-[32%] rotate-[7deg] z-30',
  'left-[70%] top-[4%] w-[27%] -rotate-[4deg] z-0',
]

export function HomePage() {
  const picks = staffPicks()
  const lead = picks[0]
  const rest = picks.slice(1, 5)
  const arrivals = newArrivals()
  const heroBooks = [picks[0], picks[1], picks[2], picks[3]]

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-14 pt-12 md:px-10 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h1 className="text-[clamp(2.8rem,6vw,5rem)] leading-[1.06]">
              หนังสือที่อ่านช้า
              <br />
              <span className="text-brick">แต่จำได้นาน</span>
            </h1>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-[1.9] text-ink-soft">
              ร้านเล็ก ๆ ของคนที่เชื่อว่าการเลือกหนังสือสักเล่ม ควรใช้เวลามากกว่าการเลื่อนฟีด
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/category/novel" className="btn-primary">
                เริ่มเลือกหนังสือ
              </Link>
              <Link to="/#staff-picks" className="btn-ghost">
                ดูที่บรรณาธิการเลือก
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-3 gap-3 lg:hidden">
              {heroBooks.slice(0, 3).map((book) => (
                <Link key={book.slug} to={`/book/${book.slug}`} className="block">
                  <BookCover book={book} className="aspect-[2/3] w-full" />
                </Link>
              ))}
            </div>

            <div className="relative hidden aspect-[6/5] lg:block" aria-label="หนังสือแนะนำจากร้าน">
              {heroBooks.map((book, index) => (
                <Link
                  key={book.slug}
                  to={`/book/${book.slug}`}
                  className={`absolute block aspect-[2/3] transition-transform duration-500 ease-out hover:-translate-y-2 ${HERO_LAYOUT[index]}`}
                >
                  <BookCover book={book} priority={index === 1} className="h-full w-full" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20">
          <h2 className="text-[clamp(1.8rem,3.2vw,2.6rem)]">หมวดหมู่</h2>
          <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.9] text-ink-soft">
            เราแบ่งชั้นหนังสือตามอารมณ์ที่อยากได้ตอนหยิบขึ้นมา ไม่ใช่ตามสำนักพิมพ์
          </p>

          <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/category/${category.slug}`}
                  className="group flex items-center justify-between gap-4 border-b border-line py-5"
                >
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-display text-[clamp(1.35rem,2.2vw,1.85rem)] transition-colors group-hover:text-brick">
                      {category.label}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] text-ink-mute">
                      {category.labelEn.toUpperCase()}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-[12px] text-ink-mute">
                    {countInCategory(category.slug)} เล่ม
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="staff-picks" className="scroll-mt-24 border-t border-line bg-paper-deep/60">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[clamp(1.8rem,3.2vw,2.6rem)]">เลือกโดยบรรณาธิการ</h2>
              <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.9] text-ink-soft">
                ห้าเล่มที่เราอยากยื่นให้ถึงมือคุณก่อนใคร พร้อมเหตุผลสั้น ๆ ว่าทำไม
              </p>
            </div>
            <Link
              to="/search"
              className="text-[13px] text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-brick"
            >
              ดูหนังสือทั้งหมด
            </Link>
          </div>

          <div className="mt-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <article className="lg:col-span-5">
                <Link to={`/book/${lead.slug}`} className="group block">
                  <BookCover
                    book={lead}
                    priority
                    className="aspect-[2/3] w-full max-w-[400px]"
                  />
                  <h3 className="mt-5 font-display text-[28px] leading-tight transition-colors group-hover:text-brick">
                    {lead.titleTh}
                  </h3>
                  <p className="mt-1 text-[13px] text-ink-mute">{lead.author}</p>
                  <p className="mt-3 max-w-[40ch] text-[14px] leading-[1.9] text-ink-soft">
                    {lead.blurb}
                  </p>
                  {lead.note ? (
                    <p className="mt-4 max-w-[38ch] border-l-2 border-brick pl-3 text-[14px] leading-[1.8]">
                      {lead.note}
                    </p>
                  ) : null}
                </Link>
              </article>

              <ul className="flex h-full flex-col gap-6 sm:grid sm:grid-cols-2 lg:col-span-7 lg:flex lg:flex-col lg:justify-start lg:gap-9">
                {rest.map((book) => (
                  <li
                    key={book.slug}
                    className="lg:border-t lg:border-line lg:pt-7 lg:first:border-t-0 lg:first:pt-0"
                  >
                    <Link to={`/book/${book.slug}`} className="group flex gap-4">
                      <BookCover book={book} className="aspect-[2/3] w-[76px] shrink-0 lg:w-[112px]" />
                      <div className="min-w-0 py-0.5">
                        <h3 className="font-display text-[19px] leading-snug transition-colors group-hover:text-brick lg:text-[22px]">
                          {book.titleTh}
                        </h3>
                        <p className="mt-0.5 text-[12px] text-ink-mute">{book.author}</p>
                        <p className="mt-1 text-[13px] tabular-nums">{baht(book.price)}</p>
                        {book.note ? (
                          <p className="mt-2 hidden max-w-[42ch] text-[12px] leading-relaxed text-ink-soft sm:block">
                            {book.note}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="new" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.8rem,3.2vw,2.6rem)]">เพิ่งเข้าชั้น</h2>
            <Link
              to="/search"
              className="text-[13px] text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-brick"
            >
              ดูทั้งหมด
            </Link>
          </div>

          <ul className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
            {arrivals.map((book) => (
              <li key={book.slug} className="w-[46%] shrink-0 snap-start sm:w-[30%] md:w-[22%] lg:w-[16%]">
                <BookCard book={book} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-paper-deep/60">
        <div className="mx-auto max-w-[880px] px-5 py-20 text-center md:px-10 md:py-24">
          <blockquote className="font-display text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.4]">
            “เราไม่ได้ขายหนังสือทุกเล่ม
            <br className="hidden sm:block" />
            แค่เล่มที่เราอยากให้มีคนอ่าน”
          </blockquote>
          <p className="mt-6 text-[13px] text-ink-mute">กระดาษพับ, ร้านหนังสือออนไลน์</p>
        </div>
      </section>
    </>
  )
}
