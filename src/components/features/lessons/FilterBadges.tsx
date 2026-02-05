import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterBadgesProps {
  regions: string[];
  categories: string[];
  onRemoveRegion: (region: string) => void;
  onRemoveCategory: (category: string) => void;
}

export const FilterBadges: React.FC<FilterBadgesProps> = ({
  regions,
  categories,
  onRemoveRegion,
  onRemoveCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 p-4 border rounded-md bg-gray-50 min-h-[40px]">
      {regions.map((region) => (
        <Badge
          key={region}
          variant="default"
          className="flex items-center gap-1"
        >
          {region}
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => onRemoveRegion(region)}
          />
        </Badge>
      ))}
      {categories.map((category) => (
        <Badge
          key={category}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {category}
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => onRemoveCategory(category)}
          />
        </Badge>
      ))}
      {regions.length === 0 && categories.length === 0 && (
        <span className="text-gray-500">선택된 필터가 없습니다.</span>
      )}
    </div>
  );
};
