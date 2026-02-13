import { MoreVertical } from 'lucide-react';

import { ClassInfoBody } from '@/components/common/ClassInfoBody';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/models/lesson.model';

import { ClassManageButtons } from './ClassManageButtons';

interface ClassManageCardProps {
	lesson: Lesson;
	onEdit: () => void;
	onDelete: () => void;
	onDuplicate: () => void;
	onManage: () => void;
	onViewClass: () => void;
	onToggleStatus: () => void;
}

export const ClassManageCard = ({
	lesson,
	onEdit,
	onDelete,
	onDuplicate,
	onManage,
	onViewClass,
	onToggleStatus,
}: ClassManageCardProps) => {
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return (
					<Badge
						variant="active"
						className="px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm"
					>
						운영중
					</Badge>
				);
			case 'INACTIVE':
				return (
					<Badge
						variant="inactive"
						className="px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm bg-gray-400 text-white border-none"
					>
						휴면
					</Badge>
				);
			case 'DRAFT':
				return (
					<Badge
						variant="secondary"
						className="px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm"
					>
						임시저장
					</Badge>
				);
			default:
				return (
					<Badge variant="outline" className="px-2.5 py-1 text-xs font-bold rounded-lg">
						{status}
					</Badge>
				);
		}
	};

	return (
		<div className="flex flex-col border rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-500 w-full aspect-[3/4.2] shadow-sm group">
			{/* 1. 사진 영역 - 유동적으로 확장됨 */}
			<div className="relative flex-1 w-full overflow-hidden bg-muted">
				<div className="absolute top-3 left-3 z-10">{getStatusBadge(lesson.status)}</div>
				<div className="absolute top-3 right-3 z-10 ">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-9 w-9 bg-white/90 hover:bg-white  shadow-md backdrop-blur-sm transition-all active:scale-90"
							>
								<MoreVertical className="h-4.5 w-4.5 text-gray-700" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="border-gray-100 p-1.5 shadow-xl "
						>
							<DropdownMenuItem
								onClick={onDuplicate}
								className="cursor-pointer  font-medium"
							>
								클래스 복제
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={onToggleStatus}
								className="cursor-pointer font-medium"
							>
								{lesson.status === 'ACTIVE' ? '휴면' : '휴면 해제'}
							</DropdownMenuItem>
							<div className="h-px bg-gray-100 my-1" />
							<DropdownMenuItem
								onClick={onDelete}
								className="text-destructive cursor-pointer font-bold"
							>
								삭제
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{lesson.status === 'INACTIVE' && (
					<div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
						<span className="bg-black/60 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20">
							내용 수정에서 활성화
						</span>
					</div>
				)}
				<img
					src={lesson.representativeImage}
					alt={lesson.title}
					className={cn(
						'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110',
						lesson.status === 'INACTIVE' && 'grayscale-[0.5]',
					)}
				/>
			</div>

			{/* 2. 정보 영역 - 공통 컴포넌트 사용하되 비율과 패딩은 완벽 유지 */}
			<div className="p-3 flex flex-col gap-2.5 bg-white shrink-0 border-t border-gray-50">
				<ClassInfoBody
					title={lesson.title}
					category={lesson.classCategory?.name || '전체'}
					price={lesson.price}
					discountRate={lesson.discountRate}
					discountedPrice={lesson.discountedPrice}
					showDate={false}
					titleClassName="line-clamp-1 group-hover:text-primary transition-colors"
					className="gap-1.5"
				/>

				<ClassManageButtons onManage={onManage} onViewClass={onViewClass} onEdit={onEdit} />
			</div>
		</div>
	);
};
