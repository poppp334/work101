import { Link } from 'react-router-dom'
import { categories } from '../data'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-deep/70">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-[26px] leading-none">กระดาษพับ</p>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.9] text-ink-soft">
              ร้านหนังสือออนไลน์เล็ก ๆ ที่เลือกทุกเล่มด้วยมือ เพราะเชื่อว่าหนังสือดี ๆ
              ควรถูกส่งต่อด้วยคำแนะนำ ไม่ใช่ algorithm
            </p>
          </div>

          <nav aria-label="หมวดหมู่ในFooter" className="md:col-span-4">
            <h2 className="text-[12px] text-ink-mute">หมวดหมู่</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-[14px] text-ink-soft transition-colors hover:text-brick"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-[12px] text-ink-mute">ติดต่อร้าน</h2>
            <p className="mt-4 text-[14px] leading-[1.9] text-ink-soft">
              hello@paperfold.example
              <br />
              จันทร์ถึงเสาร์ 10:00 ถึง 19:00
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[12px] text-ink-mute md:flex-row md:items-center md:justify-between">
          <p>© 2026 กระดาษพับ</p>
          <p>เว็บตัวอย่างสำหรับทดสอบ ยังไม่มีการชำระเงินจริง</p>
        </div>
      </div>
    </footer>
  )
}
