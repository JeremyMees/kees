import { Minus, Plus } from 'lucide-react'
import { forwardRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface NumberInputProps {
  onValueChange: (value: number | undefined) => void
  value: number
  min: number
  max: number
  stepper?: number
  className?: string
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(props, ref) {
    const { stepper, min, max, onValueChange, value, className } = props

    function handleIncrement() {
      const newValue = value + (stepper ?? 1)
      if (newValue <= max) onValueChange(newValue)
    }

    function handleDecrement() {
      const newValue = value - (stepper ?? 1)
      if (newValue >= min) onValueChange(newValue)
    }

    return (
      <div
        className={cn('flex items-center border rounded-md w-fit', className)}
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={handleDecrement}
          disabled={value === min}
        >
          <Minus />
        </Button>
        <span className="text-sm font-semibold border-x px-2">{value}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={handleIncrement}
          disabled={value === max}
        >
          <Plus />
        </Button>
      </div>
    )
  }
)
