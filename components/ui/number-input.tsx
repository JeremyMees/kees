import { Minus, Plus } from 'lucide-react';
import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';

export interface NumberInputProps {
  onValueChange: (value: number | undefined) => void;
  value: number;
  min: number;
  max: number;
  stepper?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(props, ref) {
    const { stepper, min, max, onValueChange, value } = props;

    function handleIncrement() {
      const newValue = value + (stepper ?? 1);
      if (newValue <= max) onValueChange(newValue);
    };

    function handleDecrement() {
      const newValue = value - (stepper ?? 1);
      if (newValue >= min) onValueChange(newValue);
    };


    return (
      <div className="flex items-center border rounded-md w-fit">
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={handleDecrement}
          disabled={value === min}
        >
          <Minus />
        </Button>
        <span className="text-sm font-semibold border-x px-2">
          {value}
        </span>
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
    );
  }
);
