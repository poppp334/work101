# กระดาษพับ / Paperfold

POC ของร้านหนังสือออนไลน์ภาษาไทย สร้างด้วย Vite + React + TypeScript + Tailwind v4
ไม่มี backend และไม่มีระบบชำระเงิน ข้อมูลหนังสืออยู่ในไฟล์ JSON

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run preview    # preview the build
```

## หน้าเว็บ

| Route | เนื้อหา |
| --- | --- |
| `/` | หน้าแรก: hero, หมวดหมู่, หนังสือที่บรรณาธิการเลือก, ของใหม่ |
| `/category/:slug` | หมวดหมู่ พร้อมกรองราคา / สินค้าพร้อมส่ง และเรียงลำดับ |
| `/book/:slug` | หน้ารายละเอียดหนังสือ เรื่องย่อ บันทึกบรรณาธิการ ข้อมูลเล่ม |
| `/search` | ค้นหาแบบทันที (ชื่อไทย ชื่ออังกฤษ ผู้แต่ง หมวด) |
| อื่น ๆ | 404 |

ตะกร้าเป็น drawer ใช้งานได้ทุกหน้า เก็บใน `localStorage` (คีย์ `paperfold.cart.v1`)

## Data

```
src/data/categories.json   6 หมวด
src/data/books.json        36 เล่ม
public/covers/*.jpg        ปกที่แคชไว้ในเครื่อง
```

`books.json` ถูกสร้างจาก `scripts/build-catalog.mjs` ซึ่งรวมข้อมูลบรรณาธิการ (ชื่อไทย
เรื่องย่อ บันทึก ราคา) เข้ากับข้อมูลจาก Open Library (ISBN, จำนวนหน้า, ปก)
จากนั้น `scripts/fetch-covers.mjs` จะดาวน์โหลดปกมาเก็บใน `public/covers`

```bash
npm run catalog          # สร้าง books.json ใหม่จาก Open Library
node scripts/fetch-covers.mjs
```

ถ้าไม่มีไฟล์ปก ระบบจะแสดง "house jacket" ที่สร้างจากชื่อหนังสือโดยอัตโนมัติ
(ดูตัวอย่างได้ที่ `/book/naruto-vol-1`)

## Deploy

GitHub Pages project site: <https://poppp334.github.io/work101/>

- `vite.config.ts` sets `base: '/work101/'` for production builds only
- `scripts/postbuild-pages.mjs` copies `index.html` to `404.html` so deep links
  reach the SPA (GitHub Pages serves that file for unknown paths)
- `.github/workflows/deploy.yml` builds and publishes `dist` on every push to `main`

## Design notes

- ฟอนต์ Taviraj (display) + IBM Plex Sans Thai Looped (body) โหลดผ่าน `@fontsource`
- โทนกระดาษ + มะกอก + ชาด ไม่มี gradient หรือ glassmorphism
- มุมทุกชิ้นเป็นเหลี่ยม (radius 0) ตามกลิ่นสิ่งพิมพ์
- Motion ใช้ CSS transition สั้น ๆ และเคารพ `prefers-reduced-motion`
- ข้อมูลร้าน ราคา และอีเมลเป็นข้อมูลตัวอย่างสำหรับ POC
