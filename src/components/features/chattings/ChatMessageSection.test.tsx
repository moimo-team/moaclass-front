import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ChatMessageSection from '@/components/features/chattings/ChatMessageSection';
import { BASE_MEETING_ROOM, createChatMessageFixture } from '@/test/fixtures/chat.fixture';

describe('ChatMessageSection keyboard behavior', () => {
	it('does not send message on Enter while composing', () => {
		const sendMessage = vi.fn();
		render(
			<ChatMessageSection
				selectedMeeting={BASE_MEETING_ROOM}
				messages={[createChatMessageFixture({ id: 1 })]}
				sendMessage={sendMessage}
				inputValue="hello"
				setInputValue={vi.fn()}
				onBackToList={vi.fn()}
				scrollRef={{ current: null }}
				userId={46}
			/>,
		);

		const input = screen.getByPlaceholderText('메시지를 입력하세요...');
		fireEvent.keyDown(input, {
			key: 'Enter',
			code: 'Enter',
			isComposing: true,
		});

		expect(sendMessage).not.toHaveBeenCalled();
	});
});
