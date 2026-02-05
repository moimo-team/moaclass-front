import React, { useEffect, useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
  className?: string;
}

export function DualRangeSlider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  formatLabel,
  className,
}: DualRangeSliderProps) {
  const [minInput, setMinInput] = useState(value[0].toString());
  const [maxInput, setMaxInput] = useState(value[1].toString());

  useEffect(() => {
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  }, [value]);

  const debouncedOnValueChange = useMemo(
    () =>
      debounce((newValue: [number, number]) => {
        onValueChange(newValue);
      }, 300),
    [onValueChange],
  );

  const handleSliderChange = (newValue: number[]) => {
    if (newValue.length === 2) {
      onValueChange([newValue[0], newValue[1]]);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setMinInput(rawValue);

    const numValue = Number(rawValue);
    if (!isNaN(numValue)) {
      const newMin = Math.max(min, Math.min(numValue, value[1]));
      debouncedOnValueChange([newMin, value[1]]);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setMaxInput(rawValue);

    const numValue = Number(rawValue);
    if (!isNaN(numValue)) {
      const newMax = Math.min(max, Math.max(numValue, value[0]));
      debouncedOnValueChange([value[0], newMax]);
    }
  };

  const handleBlur = () => {
    let currentMin = Number(minInput);
    let currentMax = Number(maxInput);

    if (isNaN(currentMin)) currentMin = min;
    if (isNaN(currentMax)) currentMax = max;

    let finalMin = Math.max(min, Math.min(currentMin, max));
    let finalMax = Math.min(max, Math.max(currentMax, min));

    if (finalMin > finalMax) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

    setMinInput(finalMin.toString());
    setMaxInput(finalMax.toString());

    if (value[0] !== finalMin || value[1] !== finalMax) {
      onValueChange([finalMin, finalMax]);
    }
  };

  const displayMin =
    formatLabel && minInput ? formatLabel(Number(minInput)) : minInput;
  const displayMax =
    formatLabel && maxInput ? formatLabel(Number(maxInput)) : maxInput;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-24">
          <Input
            type="text"
            value={displayMin}
            onChange={handleMinInputChange}
            onBlur={handleBlur}
            className="h-8 text-center text-sm font-medium px-1"
          />
        </div>
        <div className="flex-1 px-2">
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            onValueChange={handleSliderChange}
            className="cursor-pointer"
            minStepsBetweenThumbs={1}
          />
        </div>
        <div className="relative w-24">
          <Input
            type="text"
            value={displayMax}
            onChange={handleMaxInputChange}
            onBlur={handleBlur}
            className="h-8 text-center text-sm font-medium px-1"
          />
        </div>
      </div>
    </div>
  );
}
