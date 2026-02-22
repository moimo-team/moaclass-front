import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LessonChatMessageSection from '@/components/features/chattings/LessonChatMessageSection';
import { BASE_LESSON_ROOM, createChatMessageFixture } from '@/test/fixtures/chat.fixture';

vi.mock('@/components/features/chattings/ChatMessageSection', () => ({
	default: ({ hostBadgeLabel }: { hostBadgeLabel?: string }) => (
		<div data-testid="host-badge-label">{hostBadgeLabel}</div>
	),
}));

describe('LessonChatMessageSection', () => {
	it('passes mentor badge label to ChatMessageSection', () => {
		render(
			<LessonChatMessageSection
				selectedRoom={BASE_LESSON_ROOM}
				messages={[createChatMessageFixture({ id: 1, roomId: BASE_LESSON_ROOM.roomId })]}
				sendMessage={vi.fn()}
				inputValue=""
				setInputValue={vi.fn()}
				onBackToList={vi.fn()}
				scrollRef={{ current: null }}
				userId={46}
			/>,
		);

		expect(screen.getByTestId('host-badge-label')).toHaveTextContent('모멘토');
	});
});
