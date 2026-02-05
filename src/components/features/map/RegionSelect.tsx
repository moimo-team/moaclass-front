import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REGIONS } from "@/constants/regions";
import { cn } from "@/lib/utils";

interface RegionSelectProps {
    value: string | number | undefined;
    onValueChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
    valueType?: "id" | "name";
}

export const RegionSelect = ({
    value,
    onValueChange,
    placeholder = "지역을 선택해주세요.",
    className,
    valueType = "id"
}: RegionSelectProps) => {
    return (
        <Select
            onValueChange={(val) => {
                const newValue = valueType === "id" ? Number(val) : val;
                onValueChange(newValue);
            }}
            value={value ? value.toString() : undefined}
        >
            <SelectTrigger className={cn("w-50 bg-white border-gray-200 rounded-lg focus-visible:ring-yellow-400 text-sm", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
                {REGIONS.map((region) => (
                    <SelectItem key={region.id} value={valueType === "id" ? region.id.toString() : region.name}>
                        {region.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
