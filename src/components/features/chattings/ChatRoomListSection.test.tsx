import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ChatRoomListSection from '@/components/features/chattings/ChatRoomListSection';
import { BASE_MEETING_ROOM, createChatRoomFixture } from '@/test/fixtures/chat.fixture';

vi.mock('@/store/authStore', () => ({
	useAuthStore: () => ({
		nickname: '테스터',
	}),
}));

describe('ChatRoomListSection selection', () => {
	it('applies selected style to selected room', () => {
		const room1 = BASE_MEETING_ROOM;
		const room2 = createChatRoomFixture({
			roomId: 202,
			meetingId: 22,
			title: '선택된 방',
		});

		const { container } = render(
			<ChatRoomListSection
				chatRooms={[room1, room2]}
				isLoading={false}
				onSelectRoom={vi.fn()}
				selectedMeetingId={room2.meetingId}
			/>,
		);

		const selectedContainers = container.querySelectorAll('div.bg-muted\\/50');
		expect(selectedContainers.length).toBe(1);
		expect(screen.getByText('선택된 방')).toBeInTheDocument();
	});
});
