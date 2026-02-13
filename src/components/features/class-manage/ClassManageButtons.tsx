import { Pencil, Calendar, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ClassManageActionsProps {
	onManage: () => void;
	onViewClass: () => void;
	onEdit: () => void;
}

export const ClassManageButtons = ({ onManage, onViewClass, onEdit }: ClassManageActionsProps) => {
	return (
		<div className="space-y-2.5">
			<Button
				variant="outline"
				className="w-full h-10 border-[1.5px] border-primary text-primary hover:bg-primary/5 shadow-none font-bold gap-2 rounded-lg"
				onClick={onManage}
			>
				<Calendar className="w-4 h-4" />
				일정 및 예약 관리
			</Button>
			<div className="flex gap-2">
				<Button
					variant="outline"
					className="flex-1 h-10 border-[1.5px] border-primary text-primary hover:bg-primary/5 shadow-none font-bold gap-2 rounded-lg text-sm"
					onClick={onViewClass}
				>
					<Eye className="w-4 h-4" />
					클래스 보기
				</Button>
				<Button
					variant="outline"
					className="flex-1 h-10 border-[1.5px] border-primary text-primary hover:bg-primary/5 shadow-none font-bold gap-2 rounded-lg text-sm"
					onClick={onEdit}
				>
					<Pencil className="w-4 h-4" />
					내용 수정
				</Button>
			</div>
		</div>
	);
};
