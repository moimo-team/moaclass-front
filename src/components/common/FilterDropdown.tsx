import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface FilterDropdownItem {
	key: number;
	label: string;
	href?: string;
}

interface FilterDropdownProps {
	title: string;
	items: FilterDropdownItem[];
	allOptionHref?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
	title,
	items,
	allOptionHref = '/lessons',
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					{title}
					<ChevronDown className="w-4 h-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
				<DropdownMenuItem asChild>
					<Link to={allOptionHref}>전체 보기</Link>
				</DropdownMenuItem>
				{items.map((item) => (
					<DropdownMenuItem key={item.key} asChild>
						{item.href ? (
							<Link to={item.href}>{item.label}</Link>
						) : (
							<span>{item.label}</span>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default FilterDropdown;
