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
				nickname: 'host',
				image: '',
			},
		});

		render(<ChatMessage message={message} isMine={false} hostId={7} hostBadgeLabel="host" />);

		const badge = screen
			.getAllByText('host')
			.find((element) => element.className.includes('bg-orange-100'));
		expect(badge).toBeTruthy();
	});

	it('shows badge for my message when forceShowHostBadge is true', () => {
		const message = createChatMessageFixture({
			senderId: 46,
			sender: {
				id: 46,
				nickname: 'myself',
				image: '',
			},
		});

		render(
			<ChatMessage
				message={message}
				isMine={true}
				hostId={9}
				hostBadgeLabel="mentor"
				forceShowHostBadge={true}
			/>,
		);

		expect(screen.getByText('mentor')).toBeInTheDocument();
	});

	it('does not show badge for non-host sender', () => {
		const message = createChatMessageFixture({
			senderId: 11,
			sender: {
				id: 11,
				nickname: 'guest',
				image: '',
			},
		});

		render(<ChatMessage message={message} isMine={false} hostId={9} hostBadgeLabel="mentor" />);

		expect(screen.queryByText('mentor')).not.toBeInTheDocument();
	});
});
