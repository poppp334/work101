import { Minus, Plus } from '@phosphor-icons/react'

interface QuantityStepperProps {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 12,
  size = 'md',
}: QuantityStepperProps) {
  const buttonClass =
    size === 'sm'
      ? 'flex h-7 w-7 items-center justify-center text-ink-soft disabled:opacity-30'
      : 'flex h-10 w-10 items-center justify-center text-ink-soft disabled:opacity-30'

  return (
    <div className="inline-flex items-center border border-line bg-paper-card" role="group" aria-label="จำนวน">
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="ลดจำนวน"
      >
        <Minus size={14} weight="bold" />
      </button>
      <span
        className={`text-center text-[14px] tabular-nums ${size === 'sm' ? 'w-7' : 'w-9'}`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="เพิ่มจำนวน"
      >
        <Plus size={14} weight="bold" />
      </button>
    </div>
  )
}
