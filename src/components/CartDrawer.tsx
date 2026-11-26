import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Trash, X } from '@phosphor-icons/react'
import { books } from '../data'
import { useCart, type CartLine } from '../lib/cart'
import { baht } from '../lib/format'
import type { Book } from '../types'
import { BookCover } from './BookCover'
import { QuantityStepper } from './QuantityStepper'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function CartDrawer() {
  const { lines, count, subtotal, isOpen, close, setQty, remove } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [notice, setNotice] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setNotice(false)
      return
    }

    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, close])

  if (!isOpen) return null

  const items = lines
    .map((line) => {
      const book = books.find((entry) => entry.slug === line.slug)
      return book ? { line, book } : null
    })
    .filter((entry): entry is { line: CartLine; book: Book } => entry !== null)

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="overlay-in absolute inset-0 bg-ink/45"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="drawer-in absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col border-l border-line bg-paper"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cart-title" className="font-display text-[22px]">
            ตะกร้า {count > 0 ? `(${count})` : ''}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="ปิดตะกร้า"
            className="flex h-9 w-9 items-center justify-center border border-line transition-colors hover:border-ink"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={40} weight="light" className="text-ink-mute" aria-hidden="true" />
            <p className="mt-4 font-display text-[22px]">ยังไม่มีหนังสือในตะกร้า</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-mute">
              เลือกสักเล่มจากชั้นหนังสือของเรา แล้วกลับมาที่นี่อีกครั้ง
            </p>
            <Link
              to="/"
              onClick={close}
              className="btn-primary mt-6"
            >
              ไปเลือกหนังสือ
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map(({ line, book }) => (
                <li key={line.slug} className="flex gap-4 py-5">
                  <Link to={`/book/${book.slug}`} onClick={close} className="shrink-0">
                    <BookCover book={book} className="aspect-[2/3] w-[58px]" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/book/${book.slug}`}
                          onClick={close}
                          className="font-display text-[17px] leading-snug hover:text-brick"
                        >
                          {book.titleTh}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-ink-mute">{book.author}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(book.slug)}
                        aria-label={`นำ ${book.titleTh} ออกจากตะกร้า`}
                        className="shrink-0 p-1 text-ink-mute transition-colors hover:text-brick"
                      >
                        <Trash size={15} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper
                        size="sm"
                        value={line.qty}
                        onChange={(next) => setQty(book.slug, next)}
                      />
                      <p className="text-[14px] tabular-nums">{baht(book.price * line.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] text-ink-soft">ยอดรวม</span>
                <span className="font-display text-[24px] tabular-nums">{baht(subtotal)}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-mute">ยังไม่รวมค่าจัดส่ง</p>

              <button
                type="button"
                onClick={() => setNotice(true)}
                className="btn-primary mt-4 w-full"
              >
                ดำเนินการต่อ
              </button>

              {notice ? (
                <p role="status" className="mt-3 border-l-2 border-brick pl-3 text-[12px] leading-relaxed text-ink-soft">
                  นี่คือเว็บตัวอย่าง ยังไม่มีระบบชำระเงิน ตะกร้าถูกเก็บไว้ในเครื่องของคุณเท่านั้น
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
