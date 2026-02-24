import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ChatMessageSection from '@/components/features/chattings/ChatMessageSection';
import ChatRoomListSection from '@/components/features/chattings/ChatRoomListSection';
import LessonChatRoomListSection from '@/components/features/chattings/LessonChatRoomListSection';
import { BASE_MEETING_ROOM, createChatMessageFixture } from '@/test/fixtures/chat.fixture';

vi.mock('@/store/authStore', () => ({
	useAuthStore: () => ({
		nickname: '테스터',
	}),
}));

describe('chat layout scrolling', () => {
	it('chat message list uses overflow-y-auto and min-h-0', () => {
		const { container } = render(
			<ChatMessageSection
				selectedMeeting={BASE_MEETING_ROOM}
				messages={Array.from({ length: 30 }).map((_, idx) =>
					createChatMessageFixture({
						id: idx + 1,
						content: `msg-${idx + 1}`,
						createdAt: `2026-02-21T10:${String(idx).padStart(2, '0')}:00.000Z`,
					}),
				)}
				sendMessage={vi.fn()}
				inputValue=""
				setInputValue={vi.fn()}
				onBackToList={vi.fn()}
				scrollRef={{ current: null }}
				userId={46}
			/>,
		);

		const list = container.querySelector('.overflow-y-auto.min-h-0');
		expect(list).toBeTruthy();
	});

	it('meeting room list uses overflow-y-auto and min-h-0', () => {
		const { container } = render(
			<ChatRoomListSection
				chatRooms={Array.from({ length: 50 }).map((_, idx) => ({
					...BASE_MEETING_ROOM,
					roomId: 1000 + idx,
					meetingId: 2000 + idx,
					title: `room-${idx + 1}`,
				}))}
				isLoading={false}
				onSelectRoom={vi.fn()}
				selectedMeetingId={null}
			/>,
		);

		const list = container.querySelector('.overflow-y-auto.min-h-0');
		expect(list).toBeTruthy();
	});

	it('lesson room list uses overflow-y-auto and min-h-0', () => {
		const { container } = render(
			<LessonChatRoomListSection
				chatRooms={Array.from({ length: 50 }).map((_, idx) => ({
					...BASE_MEETING_ROOM,
					roomId: 3000 + idx,
					meetingId: null,
					lessonId: 5000 + idx,
					title: `lesson-room-${idx + 1}`,
				}))}
				isLoading={false}
				onSelectRoom={vi.fn()}
				selectedRoomId={null}
			/>,
		);

		const list = container.querySelector('.overflow-y-auto.min-h-0');
		expect(list).toBeTruthy();
	});
});
