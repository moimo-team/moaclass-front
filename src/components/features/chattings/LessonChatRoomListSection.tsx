import { Fragment } from 'react';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import ChatRoomItem from '@/components/features/chattings/ChatRoomItem';
import { Separator } from '@/components/ui/separator';
import type { ChatRoom } from '@/models/chat.model';

interface LessonChatRoomListSectionProps {
	chatRooms: ChatRoom[] | undefined;
	isLoading: boolean;
	onSelectRoom: (room: ChatRoom) => void;
	selectedRoomId: number | null | undefined;
}

const LessonChatRoomListSection: React.FC<LessonChatRoomListSectionProps> = ({
	chatRooms,
	isLoading,
	onSelectRoom,
	selectedRoomId,
}) => {
	return (
		<div className="w-full lg:w-[28%] min-w-[300px] flex flex-col h-full min-h-0 border-r">
			<div className="p-4 font-semibold shrink-0">클래스 채팅 문의</div>
			<Separator />
			<div className="flex-1 min-h-0 overflow-y-auto">
				{isLoading ? (
					<div className="flex justify-center items-center h-full">
						<LoadingSpinner />
					</div>
				) : (
					<Fragment>
						{chatRooms?.map((room) => (
							<div
								key={room.roomId}
								onClick={() => onSelectRoom(room)}
								className={
									selectedRoomId === room.roomId
										? 'bg-muted/50'
										: 'hover:bg-muted/50'
								}
							>
								<ChatRoomItem
									id={room.roomId}
									meetingImage={room.image}
									meetingTitle={room.title}
									lastMessageContent={
										room.lastMessage?.content || '대화를 시작하세요'
									}
									lastMessageTime={
										room.lastMessage?.createdAt
											? new Date(
													room.lastMessage.createdAt,
												).toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit',
												})
											: ''
									}
								/>
							</div>
						))}
						{(!chatRooms || chatRooms.length === 0) && (
							<div className="p-4 text-muted-foreground">
								참여 중인 클래스 채팅방이 없습니다.
							</div>
						)}
					</Fragment>
				)}
			</div>
		</div>
	);
};

export default LessonChatRoomListSection;
