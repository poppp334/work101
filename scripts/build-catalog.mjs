// One-time catalog builder.
// Curated Thai copy lives here; Open Library supplies cover id, ISBN and page count.
// Output: src/data/books.json (the app's single source of truth).

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

const CATEGORIES = [
  { slug: 'novel', label: 'นวนิยาย', labelEn: 'Novel', blurb: 'เรื่องเล่าที่พาเราไปอยู่ในชีวิตของคนอื่นสักระยะ' },
  { slug: 'manga', label: 'มังงะ', labelEn: 'Manga', blurb: 'ภาพและบทสนทนาที่อ่านต่อเนื่องเหมือนได้ดูหนัง' },
  { slug: 'poetry', label: 'กวีนิพนธ์', labelEn: 'Poetry', blurb: 'ภาษาที่ถูกตัดให้เหลือเท่าที่จำเป็น' },
  { slug: 'nonfiction', label: 'สารคดี', labelEn: 'Non-fiction', blurb: 'เรื่องจริงที่เล่าได้น่าติดตามเท่านิยาย' },
  { slug: 'art', label: 'ศิลปะและดีไซน์', labelEn: 'Art & Design', blurb: 'หนังสือที่ช่วยให้มองเห็นสิ่งที่เคยมองข้าม' },
  { slug: 'children', label: 'หนังสือเด็ก', labelEn: 'Children', blurb: 'เล่มแรกที่ทำให้เด็กคนหนึ่งอยากอ่านเล่มต่อไป' },
]

const BOOKS = [
  // ---------- นวนิยาย ----------
  {
    slug: 'nineteen-eighty-four', category: 'novel',
    titleTh: '2492', titleEn: 'Nineteen Eighty-Four', author: 'George Orwell',
    price: 385, pages: 384, year: 1949, publisher: 'ผีเสื้อ',
    tags: ['ดิสโทเปีย', 'คลาสสิก'],
    blurb: 'โลกที่ทุกคำพูดถูกจดบันทึก และความจริงถูกเขียนใหม่ได้ทุกเช้า วินสตัน สมิธ ทำงานแก้ประวัติศาสตร์อยู่ในกระทรวงความจริง จนวันที่เขาตัดสินใจจำสิ่งที่ตัวเองเห็น',
    note: 'อ่านรอบแรกตอนยี่สิบ อ่านรอบสองแล้วกลัวกว่าตอนนั้น',
    stock: 'in',
  },
  {
    slug: 'the-great-gatsby', category: 'novel',
    titleTh: 'เดอะ เกรท แกตสบี้', titleEn: 'The Great Gatsby', author: 'F. Scott Fitzgerald',
    price: 340, pages: 208, year: 1925, publisher: 'แพรว',
    tags: ['คลาสสิก', 'อเมริกัน'],
    blurb: 'ฤดูร้อนปี 1922 นิค คาร์ราเวย์ ย้ายไปอยู่ข้างบ้านเศรษฐีที่จัดปาร์ตี้ทุกคืน โดยไม่รู้ว่าทั้งปาร์ตี้มีไว้เพื่อรอใครคนเดียว',
    note: 'เล่มที่ทำให้คำว่าแสงสีเขียวไม่เหมือนเดิมอีก',
    stock: 'in',
  },
  {
    slug: 'norwegian-wood', category: 'novel',
    titleTh: 'นอร์เวย์เยอร์', titleEn: 'Norwegian Wood', author: 'Haruki Murakami',
    price: 395, pages: 392, year: 1987, publisher: 'กำมะหยี่',
    tags: ['ญี่ปุ่น', 'ร่วมสมัย'],
    blurb: 'เพลงของบีทเทิลส์พาวาตานาเบะย้อนความจำไปหาเด็กสาวคนหนึ่งในฤดูใบไม้ร่วงปี 1969 ความรักที่ไม่ได้จบลงแค่การจากไป',
    note: null,
    stock: 'in',
  },
  {
    slug: 'the-little-prince', category: 'novel',
    titleTh: 'เจ้าชายน้อย', titleEn: 'The Little Prince', author: 'Antoine de Saint-Exupéry',
    price: 295, pages: 120, year: 1943, publisher: 'อมรินทร์',
    tags: ['คลาสสิก', 'ฝรั่งเศส'],
    blurb: 'นักบินตกอยู่ในทะเลทรายซาฮารา และได้พบเด็กชายตัวเล็กที่เล่าเรื่องดาวเคราะห์ของเขาให้ฟัง',
    note: 'หนังสือเด็กที่อ่านตอนโตแล้วเจ็บกว่าเดิม',
    stock: 'in',
  },
  {
    slug: 'the-catcher-in-the-rye', category: 'novel',
    titleTh: 'ผู้เฝ้ารอในทุ่งข้าวไรย์', titleEn: 'The Catcher in the Rye', author: 'J. D. Salinger',
    price: 320, pages: 288, year: 1951, publisher: 'ผีเสื้อ',
    tags: ['คลาสสิก', 'อเมริกัน'],
    blurb: 'สามวันในนิวยอร์กของฮอลเดน คอลฟิลด์ วัยสิบหก ที่หนีโรงเรียนมาเดินเตร่และบ่นเรื่องคนโกหกทั้งเมือง',
    note: null,
    stock: 'low',
  },
  {
    slug: 'the-remains-of-the-day', category: 'novel',
    titleTh: 'วันวานที่เหลืออยู่', titleEn: 'The Remains of the Day', author: 'Kazuo Ishiguro',
    price: 365, pages: 272, year: 1989, publisher: 'ไลบรารี่',
    tags: ['รางวัลบูเกอร์', 'อังกฤษ'],
    blurb: 'สตีเวนส์ พ่อบ้านชาวอังกฤษ ตัดสินใจออกเดินทางครั้งแรกในชีวิต เพื่อไปหาอดีตคนรักที่เขาไม่เคยสารภาพ',
    note: 'อ่านจบแล้วอยากโทรหาคนที่ไม่ได้คุยมาสองปี',
    stock: 'in',
  },

  // ---------- มังงะ ----------
  {
    slug: 'one-piece-vol-1', category: 'manga',
    titleTh: 'วันพีซ เล่ม 1', titleEn: 'One Piece, Vol. 1', author: 'Eiichiro Oda',
    price: 95, pages: 208, year: 1997, publisher: 'สยามอินเตอร์คอมิกส์',
    tags: ['โชเน็น', 'ผจญภัย'],
    blurb: 'ลูฟี่ออกเรือตามหาขุมทรัพย์ในตำนาน พร้อมลูกเรือที่แต่ละคนมีเหตุผลของตัวเอง',
    note: null,
    stock: 'in',
  },
  {
    slug: 'naruto-vol-1', category: 'manga',
    titleTh: 'นารูโตะ เล่ม 1', titleEn: 'Naruto, Vol. 1', author: 'Masashi Kishimoto',
    price: 95, pages: 192, year: 1999, publisher: 'สยามอินเตอร์คอมิกส์',
    tags: ['โชเน็น', 'นินจา'],
    blurb: 'เด็กหนุ่มที่ถูกทั้งหมู่บ้านมองข้าม ตั้งใจจะกลายเป็นผู้นำสูงสุดของหมู่บ้านนินจา',
    note: null,
    stock: 'in',
  },
  {
    slug: 'attack-on-titan-vol-1', category: 'manga',
    titleTh: 'ผ่าพิภพไททัน เล่ม 1', titleEn: 'Attack on Titan, Vol. 1', author: 'Hajime Isayama',
    price: 99, pages: 208, year: 2009, publisher: 'วิบูลย์กิจ',
    tags: ['ดาร์ก', 'แฟนตาซี'],
    blurb: 'กำแพงสามชั้นที่ปกป้องมนุษยชาติจากยักษ์กินคนแตกในวันที่เอเรนเห็นแม่ถูกกินต่อหน้าต่อตา',
    note: 'อ่านแล้ววางไม่ลง และแอบโกรธคนเขียนหลายครั้ง',
    stock: 'in',
  },
  {
    slug: 'death-note-vol-1', category: 'manga',
    titleTh: 'เดธโน้ต เล่ม 1', titleEn: 'Death Note, Vol. 1', author: 'Tsugumi Ohba',
    price: 95, pages: 200, year: 2003, publisher: 'สยามอินเตอร์คอมิกส์',
    tags: ['ระทึกขวัญ', 'สืบสวน'],
    blurb: 'สมุดบันทึกที่เขียนชื่อใครแล้วคนนั้นตาย ไลท์ เด็กมัธยมคะแนนท็อป ใช้มันตัดสินโลก จนมีนักสืบปริศนามาไล่ล่า',
    note: null,
    stock: 'out',
  },
  {
    slug: 'chainsaw-man-vol-1', category: 'manga',
    titleTh: 'เชนซอว์แมน เล่ม 1', titleEn: 'Chainsaw Man, Vol. 1', author: 'Tatsuki Fujimoto',
    price: 99, pages: 192, year: 2018, publisher: 'สยามอินเตอร์คอมิกส์',
    tags: ['ดาร์ก', 'แอ็กชัน'],
    blurb: 'เดนจิ เด็กหนุ่มที่ต้องใช้หนี้พ่อด้วยการเป็นนักล่าปีศาจ กับปีศาจเลื่อยยนต์ที่กลายเป็นเพื่อน',
    note: null,
    stock: 'in',
  },
  {
    slug: 'nana-vol-1', category: 'manga',
    titleTh: 'นานะ เล่ม 1', titleEn: 'Nana, Vol. 1', author: 'Ai Yazawa',
    price: 95, pages: 184, year: 2000, publisher: 'สยามอินเตอร์คอมิกส์',
    tags: ['โชโจ', 'ดนตรี'],
    blurb: 'สองสาวชื่อนานะพบกันบนรถไฟขบวนเดียวกัน และชีวิตก็พันกันจนแยกไม่ออก',
    note: null,
    stock: 'in',
  },

  // ---------- กวีนิพนธ์ ----------
  {
    slug: 'milk-and-honey', category: 'poetry',
    titleTh: 'น้ำนมและน้ำผึ้ง', titleEn: 'milk and honey', author: 'Rupi Kaur',
    price: 320, pages: 208, year: 2014, publisher: 'แซนด์คล็อก',
    tags: ['ร่วมสมัย', 'เยียวยา'],
    blurb: 'บทกวีสั้นว่าด้วยการเติบโต ความรัก และการเยียวยาตัวเอง แบ่งเป็นสี่บทตามช่วงของหัวใจ',
    note: null,
    stock: 'in',
  },
  {
    slug: 'leaves-of-grass', category: 'poetry',
    titleTh: 'ใบหญ้า', titleEn: 'Leaves of Grass', author: 'Walt Whitman',
    price: 420, pages: 576, year: 1855, publisher: 'สันสกฤต',
    tags: ['คลาสสิก', 'อเมริกัน'],
    blurb: 'บทกวีที่วอลต์ วิทแมน เขียนและแก้ไขไปตลอดชีวิต เกี่ยวกับร่างกาย เพื่อนมนุษย์ และถนนอเมริกัน',
    note: null,
    stock: 'low',
  },
  {
    slug: 'ariel', category: 'poetry',
    titleTh: 'แอเรียล', titleEn: 'Ariel', author: 'Sylvia Plath',
    price: 340, pages: 96, year: 1965, publisher: 'ผีเสื้อ',
    tags: ['คลาสสิก', 'สมัยใหม่'],
    blurb: 'บทกวีชุดสุดท้ายของซิลเวีย แพลธ ที่เขียนขึ้นในปีสุดท้ายของชีวิต เต็มไปด้วยภาพคมและความมืดที่สว่าง',
    note: 'อ่านช้า ๆ ทีละบท ไม่ควรอ่านรวดเดียว',
    stock: 'in',
  },
  {
    slug: 'devotions', category: 'poetry',
    titleTh: 'เดโวชันส์', titleEn: 'Devotions', author: 'Mary Oliver',
    price: 450, pages: 480, year: 2017, publisher: 'ไลบรารี่',
    tags: ['ธรรมชาติ', 'คัดสรร'],
    blurb: 'รวมบทกวีคัดสรรของแมรี โอลิเวอร์ ว่าด้วยการสังเกตธรรมชาติ ความเศร้า และการมีชีวิตอยู่ในวันธรรมดา',
    note: null,
    stock: 'in',
  },
  {
    slug: 'the-prophet', category: 'poetry',
    titleTh: 'ศาสดา', titleEn: 'The Prophet', author: 'Kahlil Gibran',
    price: 280, pages: 128, year: 1923, publisher: 'อมรินทร์',
    tags: ['คลาสสิก', 'ปรัชญา'],
    blurb: 'คำสอนของศาสดาอัลมุสตาฟาก่อนออกจากเมือง ว่าด้วยความรัก งาน และความตาย',
    note: null,
    stock: 'in',
  },
  {
    slug: 'time-is-a-mother', category: 'poetry',
    titleTh: 'เวลาเป็นดั่งมารดา', titleEn: 'Time Is a Mother', author: 'Ocean Vuong',
    price: 360, pages: 128, year: 2022, publisher: 'ไลบรารี่',
    tags: ['ร่วมสมัย', 'อัตชีวประวัติ'],
    blurb: 'บทกวีที่โอเชียน หวิญ เขียนถึงแม่ ความสูญเสีย และการกลับมาใช้ภาษาของตัวเอง',
    note: null,
    stock: 'in',
  },

  // ---------- สารคดี ----------
  {
    slug: 'sapiens', category: 'nonfiction',
    titleTh: 'เซเปียนส์', titleEn: 'Sapiens', author: 'Yuval Noah Harari',
    price: 495, pages: 512, year: 2011, publisher: 'ซอลท์',
    tags: ['ประวัติศาสตร์', 'มนุษยศาสตร์'],
    blurb: 'ประวัติศาสตร์ย่อของมนุษยชาติ จากลิงที่เริ่มใช้ไฟ ถึงวันที่เราสร้างเงินและเทพเจ้า',
    note: null,
    stock: 'in',
  },
  {
    slug: 'atomic-habits', category: 'nonfiction',
    titleTh: 'อะตอมมิก แฮบบิตส์', titleEn: 'Atomic Habits', author: 'James Clear',
    price: 395, pages: 320, year: 2018, publisher: 'ซีเอ็ด',
    tags: ['พัฒนาตน', 'นิสัย'],
    blurb: 'วิธีเปลี่ยนนิสัยด้วยการปรับระบบ ไม่ใช่ด้วยกำลังใจ',
    note: null,
    stock: 'in',
  },
  {
    slug: 'educated', category: 'nonfiction',
    titleTh: 'การศึกษา', titleEn: 'Educated', author: 'Tara Westover',
    price: 420, pages: 352, year: 2018, publisher: 'มติชน',
    tags: ['บันทึกความจำ', 'การศึกษา'],
    blurb: 'ทารา เวสโตว์ โตมาโดยไม่มีโรงเรียนจนสิบเจ็ดปี และสอบเข้าเคมบริดจ์ได้',
    note: null,
    stock: 'in',
  },
  {
    slug: 'mans-search-for-meaning', category: 'nonfiction',
    titleTh: 'มนุษย์ผู้แสวงหาความหมาย', titleEn: "Man's Search for Meaning", author: 'Viktor E. Frankl',
    price: 315, pages: 192, year: 1946, publisher: 'อมรินทร์',
    tags: ['จิตวิทยา', 'คลาสสิก'],
    blurb: 'จิตแพทย์ที่ผ่านค่ายกักกัน เขียนว่าคนที่อยู่รอดคือคนที่ยังมีเหตุผลให้ตื่นขึ้นมา',
    note: null,
    stock: 'out',
  },
  {
    slug: 'braiding-sweetgrass', category: 'nonfiction',
    titleTh: 'ถักทอหญ้าหวาน', titleEn: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer',
    price: 470, pages: 408, year: 2013, publisher: 'สันสกฤต',
    tags: ['ธรรมชาติ', 'ชนพื้นเมือง'],
    blurb: 'นักพฤกษศาสตร์พื้นถิ่นเล่าเรื่องความสัมพันธ์ระหว่างคนกับพืช และสิ่งที่เราได้รับจากแผ่นดิน',
    note: null,
    stock: 'in',
  },
  {
    slug: 'the-anthropocene-reviewed', category: 'nonfiction',
    titleTh: 'บทวิจารณ์ยุคแอนโธโปซีน', titleEn: 'The Anthropocene Reviewed', author: 'John Green',
    price: 385, pages: 304, year: 2021, publisher: 'บันบุ๊คส์',
    tags: ['ความเรียง', 'ร่วมสมัย'],
    blurb: 'จอห์น กรีน เขียนรีวิวสิ่งต่าง ๆ ในโลกยุคนี้ ตั้งแต่โรคระบาดถึงเพลงฮิตปี 2001',
    note: null,
    stock: 'in',
  },

  // ---------- ศิลปะและดีไซน์ ----------
  {
    slug: 'ways-of-seeing', category: 'art',
    titleTh: 'วิธีมอง', titleEn: 'Ways of Seeing', author: 'John Berger',
    price: 385, pages: 176, year: 1972, publisher: 'สันสกฤต',
    tags: ['ทฤษฎีภาพ', 'คลาสสิก'],
    blurb: 'จอห์น เบอร์เกอร์ ชวนตั้งคำถามกับภาพที่เราเห็นทุกวัน ว่าใครเป็นคนเลือกให้เรามองแบบนี้',
    note: 'เล่มที่ควรมีติดบ้านถ้าอยากเข้าใจว่าภาพทำงานกับเราอย่างไร',
    stock: 'in',
  },
  {
    slug: 'the-design-of-everyday-things', category: 'art',
    titleTh: 'ดีไซน์ของสิ่งของในชีวิตประจำวัน', titleEn: 'The Design of Everyday Things', author: 'Don Norman',
    price: 450, pages: 368, year: 1988, publisher: 'ลายแปด',
    tags: ['ยูเอ็กซ์', 'ผลิตภัณฑ์'],
    blurb: 'ทำไมประตูบางบานผลักไม่ถูก และทำไมดีไซน์ที่ดีต้องทำให้เราไม่ต้องคิด',
    note: null,
    stock: 'in',
  },
  {
    slug: 'grid-systems', category: 'art',
    titleTh: 'ระบบกริดในการออกแบบกราฟิก', titleEn: 'Grid Systems in Graphic Design', author: 'Josef Muller-Brockmann',
    price: 890, pages: 176, year: 1981, publisher: 'ลายแปด',
    tags: ['กราฟิก', 'ตัวอักษร'],
    blurb: 'คู่มือกริดของมุลเลอร์-บร็อคมันน์ ว่าด้วยการจัดหน้าให้เป็นระเบียบโดยไม่แข็งทื่อ',
    note: null,
    stock: 'low',
  },
  {
    slug: 'elements-of-typographic-style', category: 'art',
    titleTh: 'องค์ประกอบของศิลปะการพิมพ์', titleEn: 'The Elements of Typographic Style', author: 'Robert Bringhurst',
    price: 690, pages: 352, year: 1992, publisher: 'ลายแปด',
    tags: ['ตัวอักษร', 'การพิมพ์'],
    blurb: 'ไบรน์เฮิร์สต์อธิบายตัวอักษรอย่างมีเหตุผล ตั้งแต่ช่องไฟถึงการเลือกฟอนต์ให้งาน',
    note: null,
    stock: 'in',
  },
  {
    slug: 'steal-like-an-artist', category: 'art',
    titleTh: 'ขโมยแบบศิลปิน', titleEn: 'Steal Like an Artist', author: 'Austin Kleon',
    price: 295, pages: 160, year: 2012, publisher: 'อมรินทร์',
    tags: ['ความคิดสร้างสรรค์', 'สร้างแรงบันดาลใจ'],
    blurb: 'ออสติน คลีออน เขียนว่าความคิดสร้างสรรค์มาจากการเก็บและผสม ไม่ใช่การรอแรงบันดาลใจ',
    note: null,
    stock: 'in',
  },
  {
    slug: 'bauhaus', category: 'art',
    titleTh: 'เบาเฮาส์', titleEn: 'Bauhaus', author: 'Magdalena Droste',
    price: 850, pages: 400, year: 1990, publisher: 'ไลบรารี่',
    tags: ['ประวัติศาสตร์ศิลปะ', 'สถาปัตยกรรม'],
    blurb: 'ประวัติและผลงานของโรงเรียนศิลปะที่เปลี่ยนวิธีคิดเรื่องรูปทรง สี และการใช้งาน',
    note: null,
    stock: 'in',
  },

  // ---------- หนังสือเด็ก ----------
  {
    slug: 'where-the-wild-things-are', category: 'children',
    titleTh: 'ที่ที่สัตว์ป่าอยู่', titleEn: 'Where the Wild Things Are', author: 'Maurice Sendak',
    price: 295, pages: 48, year: 1963, publisher: 'นานมีบุ๊คส์',
    tags: ['ภาพประกอบ', 'คลาสสิก'],
    blurb: 'แม็กซ์ ถูกส่งเข้านอนโดยไม่กินข้าว และเดินทางไปเกาะที่สัตว์ประหลาดอาศัยอยู่',
    note: null,
    stock: 'in',
  },
  {
    slug: 'charlottes-web', category: 'children',
    titleTh: 'สายใยชาร์ล็อตต์', titleEn: "Charlotte's Web", author: 'E. B. White',
    price: 320, pages: 192, year: 1952, publisher: 'นานมีบุ๊คส์',
    tags: ['มิตรภาพ', 'คลาสสิก'],
    blurb: 'หมูวิลเบอร์จะถูกฆ่าในฤดูหนาว แต่แมงมุมชื่อชาร์ล็อตต์มีแผนอื่น',
    note: null,
    stock: 'in',
  },
  {
    slug: 'matilda', category: 'children',
    titleTh: 'มาทิลดา', titleEn: 'Matilda', author: 'Roald Dahl',
    price: 295, pages: 240, year: 1988, publisher: 'นานมีบุ๊คส์',
    tags: ['ตลก', 'คลาสสิก'],
    blurb: 'เด็กหญิงอัจฉริยะที่ถูกพ่อแม่และครูใหญ่กดขี่ จนพบว่าตัวเองมีพลังพิเศษ',
    note: null,
    stock: 'in',
  },
  {
    slug: 'the-giving-tree', category: 'children',
    titleTh: 'ต้นไม้ผู้ให้', titleEn: 'The Giving Tree', author: 'Shel Silverstein',
    price: 265, pages: 64, year: 1964, publisher: 'นานมีบุ๊คส์',
    tags: ['ภาพประกอบ', 'ปรัชญา'],
    blurb: 'เรื่องของเด็กชายกับต้นไม้ที่ให้ทุกอย่างจนเหลือแค่ตอ พร้อมคำถามว่าให้หมายถึงอะไร',
    note: null,
    stock: 'in',
  },
  {
    slug: 'goodnight-moon', category: 'children',
    titleTh: 'ราตรีสวัสดิ์พระจันทร์', titleEn: 'Goodnight Moon', author: 'Margaret Wise Brown',
    price: 195, pages: 32, year: 1947, publisher: 'นานมีบุ๊คส์',
    tags: ['ภาพประกอบ', 'ก่อนนอน'],
    blurb: 'กระต่ายน้อยกล่าวราตรีสวัสดิ์กับทุกสิ่งในห้อง ก่อนหลับลงในคืนที่พระจันทร์ส่อง',
    note: null,
    stock: 'in',
  },
  {
    slug: 'harry-potter-1', category: 'children',
    titleTh: 'แฮร์รี่ พอตเตอร์กับศิลาอาถรรพ์', titleEn: "Harry Potter and the Philosopher's Stone", author: 'J. K. Rowling',
    price: 395, pages: 352, year: 1997, publisher: 'นานมีบุ๊คส์',
    tags: ['แฟนตาซี', 'ยอดนิยม'],
    blurb: 'เด็กชายที่โตมาในตู้ใต้บันได ได้รับจดหมายเชิญเข้าโรงเรียนเวทมนตร์ในวันเกิดปีที่สิบเอ็ด',
    note: null,
    stock: 'in',
  },
]

// Editions picked by eye from a contact sheet, more recognisable than the
// first Open Library hit for these titles.
const COVER_ID_OVERRIDES = {
  'nineteen-eighty-four': 15268029,
}
const COVER_ISBN_OVERRIDES = {
  'the-great-gatsby': '9780743273565',
  'the-little-prince': '9780156012195',
  'norwegian-wood': '9780375704024',
  'one-piece-vol-1': '9781569319017',
  'where-the-wild-things-are': '9780064431781',
  'the-design-of-everyday-things': '9780465050659',
}
const PAGES_OVERRIDES = {
  'the-little-prince': 96,
  'nana-vol-1': 184,
  'nineteen-eighty-four': 328,
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function isbn10to13(isbn10) {
  const core = isbn10.replace(/-/g, '').slice(0, 9)
  if (!/^\d{9}$/.test(core)) return null
  const base = `978${core}`
  let sum = 0
  for (let i = 0; i < 12; i++) sum += Number(base[i]) * (i % 2 === 0 ? 1 : 3)
  const check = (10 - (sum % 10)) % 10
  return `${base}${check}`
}

async function lookup(book) {
  const url = new URL('https://openlibrary.org/search.json')
  url.searchParams.set('title', book.titleEn)
  url.searchParams.set('author', book.author)
  url.searchParams.set('limit', '10')
  url.searchParams.set('fields', 'title,author_name,cover_i,isbn,number_of_pages_median,first_publish_year')
  const res = await fetch(url, { headers: { 'User-Agent': 'paperfold-poc/0.1' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const docs = json.docs ?? []
  const withCover = docs.filter((d) => typeof d.cover_i === 'number')
  const doc = withCover[0] ?? docs[0]
  if (!doc) return {}
  const isbns = doc.isbn ?? []
  const isbn13 =
    isbns.find((i) => /^97[89]\d{10}$/.test(i.replace(/-/g, ''))) ??
    isbns.map(isbn10to13).find(Boolean) ??
    null
  return {
    coverId: doc.cover_i ?? null,
    isbn13,
    pages: doc.number_of_pages_median ?? book.pages,
    year: doc.first_publish_year ?? book.year,
  }
}

const out = []
for (const [index, book] of BOOKS.entries()) {
  let meta = {}
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      meta = await lookup(book)
      break
    } catch (err) {
      if (attempt === 3) console.warn(`! ${book.slug}: ${err.message}`)
      await sleep(600 * attempt)
    }
  }
  const {
    coverId: fetchedCoverId = null,
    isbn13: fetchedIsbn = null,
    pages: fetchedPages = book.pages,
    year = book.year,
  } = meta
  const coverId = COVER_ID_OVERRIDES[book.slug] ?? fetchedCoverId
  const coverIsbn = COVER_ISBN_OVERRIDES[book.slug] ?? null
  const isbn13 = coverIsbn ?? fetchedIsbn
  const pages = PAGES_OVERRIDES[book.slug] ?? fetchedPages
  const { category, ...rest } = book
  out.push({
    id: book.slug,
    ...rest,
    category,
    isbn13,
    coverId,
    coverIsbn,
    pages,
    year,
  })
  console.log(
    `${String(index + 1).padStart(2, '0')}/36 ${book.slug.padEnd(30)} cover=${coverId ?? 'none'} isbn=${isbn13 ?? 'none'} pages=${pages}`,
  )
  await sleep(280)
}

const target = new URL('../src/data/books.json', import.meta.url)
await mkdir(dirname(target.pathname), { recursive: true })
await writeFile(target, `${JSON.stringify(out, null, 2)}\n`, 'utf8')
await writeFile(
  new URL('../src/data/categories.json', import.meta.url),
  `${JSON.stringify(CATEGORIES, null, 2)}\n`,
  'utf8',
)

const missing = out.filter((b) => !b.coverId).length
console.log(`\nwrote ${out.length} books, ${missing} without cover`)
