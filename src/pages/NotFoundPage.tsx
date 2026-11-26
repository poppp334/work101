import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[62dvh] max-w-[1400px] flex-col items-start justify-center px-5 py-20 md:px-10">
      <p className="text-[12px] tracking-[0.2em] text-ink-mute">404</p>
      <h1 className="mt-3 max-w-[28ch] text-[clamp(2rem,4.4vw,3.2rem)]">
        ไม่พบหน้าที่คุณกำลังหา
      </h1>
      <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.9] text-ink-soft">
        บางทีหน้านี้อาจถูกย้าย หรือหนังสือที่คุณตามหาอาจยังไม่ถูกบรรจุเข้าชั้น
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/" className="btn-primary">
          กลับไปหน้าแรก
        </Link>
        <Link to="/search" className="btn-ghost">
          ค้นหาหนังสือ
        </Link>
      </div>
    </section>
  )
}
