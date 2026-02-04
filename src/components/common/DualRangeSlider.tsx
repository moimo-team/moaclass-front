import React, { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string; // 인풋에 보여질 포맷 (예: 1,000원)
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
  // 인풋 입력을 위한 로컬 상태 (포맷팅된 문자열 처리를 위해 필요)
  const [minInput, setMinInput] = useState(value[0].toString());
  const [maxInput, setMaxInput] = useState(value[1].toString());

  // 부모의 value가 바뀌면 인풋 상태도 동기화
  useEffect(() => {
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  }, [value]);

  // 슬라이더 변경 핸들러
  const handleSliderChange = (newValue: number[]) => {
    onValueChange([newValue[0], newValue[1]]);
  };

  // 최소값 인풋 변경 핸들러
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 추출
    const newValue = Number(e.target.value.replace(/[^0-9]/g, ""));
    setMinInput(newValue.toString());

    // 유효성 검사 및 적용
    if (newValue < min) return; // 전체 최소값보다 작으면 무시 (혹은 min으로 고정)

    // 최대값을 넘지 않도록 조정 (교차 방지)
    const validMin = Math.min(newValue, value[1]);
    onValueChange([validMin, value[1]]);
  };

  // 최대값 인풋 변경 핸들러
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value.replace(/[^0-9]/g, ""));
    setMaxInput(newValue.toString());

    if (newValue > max) return; // 전체 최대값보다 크면 무시

    // 최소값보다 작아지지 않도록 조정 (교차 방지)
    const validMax = Math.max(newValue, value[0]);
    onValueChange([value[0], validMax]);
  };

  // 인풋 포커스 해제(Blur) 시 값이 비어있거나 이상하면 보정
  const handleBlur = () => {
    const newMin = Math.max(min, Math.min(Number(minInput), value[1]));
    const newMax = Math.min(max, Math.max(Number(maxInput), value[0]));

    setMinInput(newMin.toString());
    setMaxInput(newMax.toString());
    onValueChange([newMin, newMax]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-4">
        {/* 최소값 인풋 */}
        <div className="relative w-24">
          <Input
            type="text"
            value={formatLabel ? formatLabel(Number(minInput)) : minInput}
            onChange={handleMinInputChange}
            onBlur={handleBlur}
            className="h-8 text-center text-sm font-medium px-1"
          />
        </div>

        {/* 슬라이더 본체 */}
        <div className="flex-1 px-2">
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            onValueChange={handleSliderChange}
            className="cursor-pointer"
            // minStepsBetweenThumbs={1} // 핸들이 겹치지 않게 하려면 1 이상의 값 설정
          />
        </div>

        {/* 최대값 인풋 */}
        <div className="relative w-24">
          <Input
            type="text"
            value={formatLabel ? formatLabel(Number(maxInput)) : maxInput}
            onChange={handleMaxInputChange}
            onBlur={handleBlur}
            className="h-8 text-center text-sm font-medium px-1"
          />
        </div>
      </div>
    </div>
  );
}
