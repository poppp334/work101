import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { books } from '../data'

export interface CartLine {
  slug: string
  qty: number
}

const STORAGE_KEY = 'paperfold.cart.v1'
const MAX_QTY = 12

interface CartValue {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  open: () => void
  close: () => void
  add: (slug: string, qty?: number) => void
  setQty: (slug: string, qty: number) => void
  remove: (slug: string) => void
  clear: () => void
}

const CartContext = createContext<CartValue | null>(null)

const clampQty = (qty: number): number => Math.min(MAX_QTY, Math.max(1, Math.round(qty)))

function readStored(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((line): line is CartLine => {
        if (typeof line !== 'object' || line === null) return false
        const candidate = line as Partial<CartLine>
        return typeof candidate.slug === 'string' && typeof candidate.qty === 'number'
      })
      .filter((line) => books.some((book) => book.slug === line.slug))
      .map((line) => ({ slug: line.slug, qty: clampQty(line.qty) }))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStored)
  const [isOpen, setOpen] = useState(false)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage can be unavailable in private mode, the cart still works in memory.
    }
  }, [lines])

  const open = useCallback(() => {
    const active = document.activeElement
    lastFocus.current = active instanceof HTMLElement ? active : null
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    const target = lastFocus.current
    window.setTimeout(() => target?.focus(), 0)
  }, [])

  const add = useCallback((slug: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.slug === slug)
      if (existing) {
        return prev.map((line) =>
          line.slug === slug ? { ...line, qty: clampQty(line.qty + qty) } : line,
        )
      }
      return [...prev, { slug, qty: clampQty(qty) }]
    })
  }, [])

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      prev.map((line) => (line.slug === slug ? { ...line, qty: clampQty(qty) } : line)),
    )
  }, [])

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((line) => line.slug !== slug))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((total, line) => total + line.qty, 0)
    const subtotal = lines.reduce((total, line) => {
      const book = books.find((b) => b.slug === line.slug)
      return total + (book ? book.price * line.qty : 0)
    }, 0)
    return { lines, count, subtotal, isOpen, open, close, add, setQty, remove, clear }
  }, [lines, isOpen, open, close, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
