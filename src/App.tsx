import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './lib/cart'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { BookPage } from './pages/BookPage'
import { SearchPage } from './pages/SearchPage'
import { NotFoundPage } from './pages/NotFoundPage'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return () => cancelAnimationFrame(frame)
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function Shell() {
  const location = useLocation()

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:text-[13px]"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>

      <ScrollManager />
      <Header />

      <main id="main" key={location.pathname} className="page-enter flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/book/:slug" element={<BookPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <div className="paper-grain" aria-hidden="true" />
    </div>
  )
}

export default function App() {
  const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '')

  return (
    <BrowserRouter basename={routerBase || undefined}>
      <CartProvider>
        <Shell />
      </CartProvider>
    </BrowserRouter>
  )
}
