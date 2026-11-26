import type { Stock } from '../types'

export const baht = (value: number): string => `฿${value.toLocaleString('en-US')}`

export const stockText: Record<Stock, string> = {
  in: 'พร้อมส่ง',
  low: 'เหลือน้อย',
  out: 'หมดชั่วคราว',
}

export const stockTone: Record<Stock, string> = {
  in: 'bg-olive',
  low: 'bg-brick',
  out: 'bg-ink-mute',
}
