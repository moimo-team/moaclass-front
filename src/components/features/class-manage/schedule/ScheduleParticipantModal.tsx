import { useQuery } from '@tanstack/react-query';
import { User, MessageSquare } from 'lucide-react';

import { fetchScheduleParticipants } from '@/api/schedule.api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ScheduleParticipant } from '@/models/schedule.model';

interface ScheduleParticipantModalProps {
	scheduleId: number | null;
	isOpen: boolean;
	onClose: () => void;
	dateStr?: string;
	timeStr?: string;
}

export const ScheduleParticipantModal = ({
	scheduleId,
	isOpen,
	onClose,
	dateStr,
	timeStr,
}: ScheduleParticipantModalProps) => {
	const { data: participants, isLoading } = useQuery<ScheduleParticipant[]>({
		queryKey: ['scheduleParticipants', scheduleId],
		queryFn: () => fetchScheduleParticipants(scheduleId!),
		enabled: !!scheduleId && isOpen,
	});

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0 border-none shadow-2xl">
				<DialogHeader className="p-6 pb-4 border-b bg-gray-50/50">
					<div className="space-y-1">
						<DialogTitle className="text-xl font-black text-gray-900 tracking-tight">
							모멘티 명단
						</DialogTitle>
						<div className="flex items-center gap-2 text-[13px] text-gray-500 font-bold">
							<span className="text-carrot">{dateStr}</span>
							<span className="w-1 h-1 rounded-full bg-gray-300" />
							<span>{timeStr}</span>
						</div>
					</div>
				</DialogHeader>

				<div className="max-h-[500px] overflow-y-auto px-6 py-4 space-y-4 bg-white scrollbar-hide">
					{isLoading ? (
						<div className="py-24 text-center">
							<LoadingSpinner />
							<p className="mt-4 text-sm text-gray-400 font-extrabold tracking-tight">
								명단을 불러오는 중입니다...
							</p>
						</div>
					) : !participants || participants.length === 0 ? (
						<div className="py-24 text-center space-y-4">
							<div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-dashed border-gray-200">
								<User className="w-8 h-8 text-gray-200" />
							</div>
							<p className="text-sm text-gray-400 font-extrabold tracking-tight">
								해당 일정에 모멘티가 없습니다.
							</p>
						</div>
					) : (
						participants.map((participant: ScheduleParticipant) => (
							<div
								key={participant.userId}
								className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:border-carrot/20 hover:shadow-md hover:shadow-carrot/5 transition-all duration-300 group"
							>
								<div className="flex items-center gap-4">
									<Avatar className="w-12 h-12 border-2 border-white shadow-sm ring-1 ring-gray-100 group-hover:ring-carrot/20 transition-all">
										<AvatarImage
											src={participant.profileImage ?? ''}
											alt={participant.nickname}
										/>
										<AvatarFallback className="bg-gray-50 text-gray-400 text-xs font-black">
											{participant.nickname?.[0] ?? 'U'}
										</AvatarFallback>
									</Avatar>
									<div className="space-y-0.5">
										<div className="flex items-center gap-2">
											<span className="font-black text-[15px] text-gray-900 leading-none">
												{participant.nickname}
											</span>
											<Badge
												variant="secondary"
												className="bg-carrot/10 text-carrot hover:bg-carrot/20 text-[10px] font-black px-1.5 py-0 h-4 border-none"
											>
												모멘티
											</Badge>
										</div>
									</div>
								</div>

								<Button
									variant="outline"
									size="sm"
									className="h-8 px-3 text-[12px] font-black border-carrot/50 text-carrot hover:bg-carrot hover:text-white transition-all rounded-lg gap-1.5 shadow-sm"
								>
									<MessageSquare className="w-3.5 h-3.5" />
									{/* TODO: 채팅방 연동 */}
									문의
								</Button>
							</div>
						))
					)}
				</div>

				<div className="px-6 py-4 border-t bg-gray-50/50 flex items-center justify-end gap-3">
					<p className="text-[12px] text-gray-400 font-bold">총 신청 인원</p>
					<Badge className="bg-carrot text-white border-none px-3 py-1 font-black shadow-lg shadow-carrot/20 text-sm">
						{participants?.length || 0}명
					</Badge>
				</div>
			</DialogContent>
		</Dialog>
	);
};
