import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ChatMessage from '@/components/features/chattings/ChatMessage';
import { createChatMessageFixture } from '@/test/fixtures/chat.fixture';

describe('ChatMessage badge label', () => {
	it('shows host badge label for host message', () => {
		const message = createChatMessageFixture({
			senderId: 7,
			sender: {
				id: 7,
				nickname: '모임장',
				image: '',
			},
		});

		render(<ChatMessage message={message} isMine={false} hostId={7} hostBadgeLabel="호스트" />);

		expect(screen.getByText('호스트')).toBeInTheDocument();
	});

	it('shows mentor badge label for lesson host message', () => {
		const message = createChatMessageFixture({
			senderId: 9,
			sender: {
				id: 9,
				nickname: '모멘토',
				image: '',
			},
		});

		render(<ChatMessage message={message} isMine={false} hostId={9} hostBadgeLabel="모멘토" />);

		const badge = screen
			.getAllByText('모멘토')
			.find((element) => element.className.includes('bg-orange-100'));
		expect(badge).toBeTruthy();
	});

	it('does not show badge for non-host sender', () => {
		const message = createChatMessageFixture({
			senderId: 11,
			sender: {
				id: 11,
				nickname: '참가자',
				image: '',
			},
		});

		render(<ChatMessage message={message} isMine={false} hostId={9} hostBadgeLabel="모멘토" />);

		expect(screen.queryByText('모멘토')).not.toBeInTheDocument();
	});
});
