import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface FilterToggleGroupProps {
  label: string;
  // 문자열 배열 또는 객체 배열({ label, value }) 모두 지원
  options: string[] | { label: string; value: string }[];
  value: string[];
  onValueChange: (value: string[]) => void;
  className?: string;
}

export const FilterToggleGroup = ({
  label,
  options,
  value,
  onValueChange,
  className,
}: FilterToggleGroupProps) => {
  // 옵션 정규화: 문자열 배열이 들어와도 객체 배열로 변환
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );

  return (
    <div
      className={cn(
        "p-2 border rounded-md bg-white flex flex-row items-center gap-6",
        className,
      )}
    >
      <span className="block text-lg font-bold text-gray-700 min-w-[70px] shrink-0">
        {label}
      </span>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={onValueChange}
        className="flex-wrap justify-start gap-1 w-full"
      >
        {normalizedOptions.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={`Toggle ${option.label}`}
            variant="outline"
            className="flex-1 min-w-[60px] whitespace-nowrap"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
