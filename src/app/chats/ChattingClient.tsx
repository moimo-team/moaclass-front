'use client';

import { useSearchParams } from 'next/navigation';

import { ChattingContent } from '@/pages/chat/Chatting';

export default function ChattingClient() {
	const searchParams = useSearchParams();
	// Next.js에서는 location state 대신 쿼리 파라미터를 사용하여 특정 채팅방 진입 대응
	const meetingIdFromQuery = searchParams.get('meetingId');

	return <ChattingContent initialMeetingId={meetingIdFromQuery} />;
}
