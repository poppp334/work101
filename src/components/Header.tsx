import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { List as MenuIcon, MagnifyingGlass, ShoppingBag, X } from '@phosphor-icons/react'
import { categories } from '../data'
import { useCart } from '../lib/cart'

const NAV = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'หมวดหมู่', to: '/#categories' },
  { label: 'เลือกโดยบรรณาธิการ', to: '/#staff-picks' },
]

export function Header() {
  const { count, open } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = term.trim()
    if (query.length === 0) {
      navigate('/search')
      return
    }
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setTerm('')
  }

  return (
    <>
      <div className="border-b border-line bg-olive-deep text-paper">
        <p className="mx-auto max-w-[1400px] px-5 py-1.5 text-center text-[12px] tracking-wide md:px-10">
          ส่งฟรีเมื่อซื้อครบ 800 บาท · สมาชิกกระดาษพับลด 5%
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-5 md:gap-8 md:px-10">
          <Link to="/" className="flex shrink-0 items-baseline gap-2">
            <span className="font-display text-[25px] leading-none">กระดาษพับ</span>
            <span className="hidden text-[9px] tracking-[0.24em] text-ink-mute sm:inline">
              PAPERFOLD
            </span>
          </Link>

          <nav aria-label="เมนูหลัก" className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[14px] text-ink-soft transition-colors hover:text-brick"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden md:block" role="search">
              <label htmlFor="site-search" className="sr-only">
                ค้นหาหนังสือ
              </label>
              <div className="flex h-9 items-center border border-line bg-paper-card pl-3 transition-colors focus-within:border-ink">
                <MagnifyingGlass size={15} className="shrink-0 text-ink-mute" aria-hidden="true" />
                <input
                  id="site-search"
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="ค้นหาชื่อหนังสือหรือผู้แต่ง"
                  className="h-full w-[180px] bg-transparent px-2 text-[13px] outline-none placeholder:text-ink-mute lg:w-[220px]"
                />
              </div>
            </form>

            <Link
              to="/search"
              aria-label="ค้นหาหนังสือ"
              className="flex h-10 w-10 items-center justify-center border border-line text-ink-soft transition-colors hover:border-ink md:hidden"
            >
              <MagnifyingGlass size={18} aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={open}
              className="relative flex h-10 items-center gap-2 border border-line px-3 text-[13px] transition-colors hover:border-ink"
              aria-label={`เปิดตะกร้า${count > 0 ? ` มีสินค้า ${count} ชิ้น` : ''}`}
            >
              <ShoppingBag size={17} aria-hidden="true" />
              <span className="hidden sm:inline">ตะกร้า</span>
              <span className="min-w-4 text-center text-[11px] tabular-nums sm:min-w-5 sm:border sm:border-ink/15 sm:bg-paper-deep sm:px-1">
                {count}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
              className="flex h-10 w-10 items-center justify-center border border-line text-ink-soft transition-colors hover:border-ink lg:hidden"
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <MenuIcon size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div id="mobile-menu" className="border-t border-line bg-paper lg:hidden">
            <div className="mx-auto max-w-[1400px] px-5 py-5 md:px-10">
              <nav aria-label="เมนูมือถือ" className="flex flex-col">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="border-b border-line py-3 font-display text-[20px]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <p className="mt-5 text-[11px] text-ink-mute">หมวดหมู่</p>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="text-[14px] text-ink-soft"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  )
}
