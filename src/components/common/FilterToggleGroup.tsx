import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface FilterToggleGroupProps {
  label: string;
  options: string[];
  value: string[];
  onValueChange: (value: string[]) => void;
  minLabelWidth?: string;
}

export const FilterToggleGroup: React.FC<FilterToggleGroupProps> = ({
  label,
  options,
  value,
  onValueChange,
  minLabelWidth = "min-w-[70px]",
}) => {
  return (
    <div className="p-2 border rounded-md bg-white flex flex-row items-center gap-6">
      <label
        className={cn("block text-lg font-bold text-gray-700", minLabelWidth)}
      >
        {label}
      </label>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={onValueChange}
        className="w-[180px]"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            aria-label={`Toggle ${option}`}
            variant="outline"
            className="flex-1"
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
