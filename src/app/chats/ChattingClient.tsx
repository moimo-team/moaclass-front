'use client';

import { useSearchParams } from 'next/navigation';

import type { ChatType } from '@/models/chat.model';
import { ChattingContent } from '@/pages/chat/Chatting';

const toNumber = (value: string | null): number | undefined => {
	if (!value) return undefined;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
};

export default function ChattingClient() {
	const searchParams = useSearchParams();
	const chatTypeValue = searchParams.get('chatType');
	const chatType: ChatType | undefined =
		chatTypeValue === 'meeting' || chatTypeValue === 'lesson' ? chatTypeValue : undefined;

	return (
		<ChattingContent
			initialRoomId={toNumber(searchParams.get('roomId'))}
			initialChatType={chatType}
			initialMeetingId={toNumber(searchParams.get('meetingId'))}
			initialLessonId={toNumber(searchParams.get('lessonId'))}
		/>
	);
}
