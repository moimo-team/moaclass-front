import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ChattingClient from '@/app/chats/ChattingClient';

const mockUseSearchParams = vi.fn();
const mockChattingContent = vi.fn();

vi.mock('next/navigation', () => ({
	useSearchParams: () => mockUseSearchParams(),
}));

vi.mock('@/pages/chat/Chatting', () => ({
	ChattingContent: (props: object) => {
		mockChattingContent(props);
		return <div data-testid="chatting-content" />;
	},
}));

describe('ChattingClient', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('parses all query params and passes to ChattingContent', () => {
		const searchParams = new URLSearchParams(
			'roomId=201&chatType=lesson&meetingId=11&lessonId=20',
		);
		mockUseSearchParams.mockReturnValue(searchParams);

		render(<ChattingClient />);

		expect(mockChattingContent).toHaveBeenCalledWith({
			initialRoomId: 201,
			initialChatType: 'lesson',
			initialMeetingId: 11,
			initialLessonId: 20,
		});
	});

	it('ignores invalid numbers and invalid chatType', () => {
		const searchParams = new URLSearchParams(
			'roomId=abc&chatType=invalid&meetingId=x&lessonId=y',
		);
		mockUseSearchParams.mockReturnValue(searchParams);

		render(<ChattingClient />);

		expect(mockChattingContent).toHaveBeenCalledWith({
			initialRoomId: undefined,
			initialChatType: undefined,
			initialMeetingId: undefined,
			initialLessonId: undefined,
		});
	});
});
