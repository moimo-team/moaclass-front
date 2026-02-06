import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRegionQuery } from "@/hooks/useRegionQuery";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface RegionSelectProps {
  value: string | number | undefined;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  valueType?: "id" | "name";
}

/**
 * 전역 지역 선택 컴포넌트
 * - UserInfo, MyPage, CreateClass 등에서 공통으로 사용
 * - h-12 높이와 일관된 디자인 적용
 */
export const RegionSelect = ({
  value,
  onValueChange,
  placeholder = "지역 선택",
  className,
  valueType = "id"
}: RegionSelectProps) => {
  const { data: regionsData, isLoading, error } = useRegionQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>에러</div>;
  }

  return (
    <Select
      onValueChange={(val) => {
        const newValue = valueType === "id" ? Number(val) : val;
        onValueChange(newValue);
      }}
      value={value ? value.toString() : undefined}
    >
      <SelectTrigger
        className={cn(
          "h-12 w-full bg-card border-input rounded-lg focus-visible:ring-primary text-sm shadow-sm",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[200px] bg-card border-input">
        {regionsData?.map((region) => (
          <SelectItem
            key={region.id}
            value={valueType === "id" ? region.id.toString() : region.name}
            className="focus:bg-primary/10 focus:text-primary cursor-pointer"
          >
            {region.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
