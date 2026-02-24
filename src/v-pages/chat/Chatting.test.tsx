import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getMyChatRooms, getRoomMessages } from '@/api/chat.api';
import type { ChatMessage } from '@/models/chat.model';
import {
	BASE_LESSON_ROOM,
	BASE_MEETING_ROOM,
	createChatRoomFixture,
	createChatMessageFixture,
} from '@/test/fixtures/chat.fixture';
import { ChattingContent } from '@/v-pages/chat/Chatting';

const mockUseLocation = vi.fn();
const mockUseAuthStore = vi.fn();
const mockSendMessage = vi.fn();
const mockToastError = vi.fn();

let capturedOnNewMessage: ((message: ChatMessage) => void) | null = null;
let capturedSelectedRoomId: number | null = null;

vi.mock('react-router-dom', () => ({
	useLocation: () => mockUseLocation(),
}));

vi.mock('@/store/authStore', () => ({
	useAuthStore: () => mockUseAuthStore(),
}));

vi.mock('@/api/chat.api', () => ({
	getMyChatRooms: vi.fn(),
	getRoomMessages: vi.fn(),
}));

vi.mock('@/hooks/useChatSocket', () => ({
	useChatSocket: (
		selectedRoomId: number | null,
		onNewMessage: (message: ChatMessage) => void,
	) => {
		capturedSelectedRoomId = selectedRoomId;
		capturedOnNewMessage = onNewMessage;
		return { sendMessage: mockSendMessage };
	},
}));

vi.mock('sonner', () => ({
	toast: {
		error: (...args: Parameters<typeof mockToastError>) => mockToastError(...args),
	},
}));

vi.mock('@/components/features/chattings/ChatRoomListSection', () => ({
	default: ({
		chatRooms,
		onSelectRoom,
		selectedMeetingId,
	}: {
		chatRooms: (typeof BASE_MEETING_ROOM)[];
		onSelectRoom: (room: typeof BASE_MEETING_ROOM) => void;
		selectedMeetingId: number | null | undefined;
	}) => (
		<div>
			<div data-testid="meeting-order">{chatRooms.map((room) => room.roomId).join(',')}</div>
			<div data-testid="selected-meeting">{String(selectedMeetingId ?? '')}</div>
			<div data-testid="meeting-titles">{chatRooms.map((room) => room.title).join('|')}</div>
			{chatRooms.map((room) => (
				<button key={room.roomId} type="button" onClick={() => onSelectRoom(room)}>
					select-{room.roomId}
				</button>
			))}
		</div>
	),
}));

vi.mock('@/components/features/chattings/LessonChatRoomListSection', () => ({
	default: ({
		chatRooms,
		onSelectRoom,
		selectedRoomId,
	}: {
		chatRooms: (typeof BASE_LESSON_ROOM)[];
		onSelectRoom: (room: typeof BASE_LESSON_ROOM) => void;
		selectedRoomId: number | null | undefined;
	}) => (
		<div>
			<div data-testid="selected-lesson">{String(selectedRoomId ?? '')}</div>
			<div data-testid="lesson-titles">{chatRooms.map((room) => room.title).join('|')}</div>
			{chatRooms.map((room) => (
				<button key={room.roomId} type="button" onClick={() => onSelectRoom(room)}>
					select-lesson-{room.roomId}
				</button>
			))}
		</div>
	),
}));

const MockMessageSection = ({
	messages,
	sendMessage,
	setInputValue,
	onBackToList,
}: {
	messages: ChatMessage[];
	sendMessage: () => void;
	setInputValue: (value: string) => void;
	onBackToList: () => void;
}) => (
	<div>
		<div data-testid="message-count">{messages.length}</div>
		<div>{messages.map((m) => m.content).join(',')}</div>
		<button type="button" onClick={() => setInputValue('hello')}>
			fill-input
		</button>
		<button type="button" onClick={sendMessage}>
			send
		</button>
		<button type="button" onClick={onBackToList}>
			back-to-list
		</button>
	</div>
);

vi.mock('@/components/features/chattings/ChatMessageSection', () => ({
	default: (props: {
		messages: ChatMessage[];
		sendMessage: () => void;
		setInputValue: (value: string) => void;
		onBackToList: () => void;
	}) => <MockMessageSection {...props} />,
}));

vi.mock('@/components/features/chattings/LessonChatMessageSection', () => ({
	default: (props: {
		messages: ChatMessage[];
		sendMessage: () => void;
		setInputValue: (value: string) => void;
		onBackToList: () => void;
	}) => <MockMessageSection {...props} />,
}));

const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false },
		},
	});

const renderWithQueryClient = (props: Partial<Parameters<typeof ChattingContent>[0]> = {}) => {
	const queryClient = createQueryClient();
	return render(
		<QueryClientProvider client={queryClient}>
			<ChattingContent initialChatType="meeting" {...props} />
		</QueryClientProvider>,
	);
};

describe('ChattingContent', () => {
	const meetingRoom1 = BASE_MEETING_ROOM;
	const meetingRoom2 = createChatRoomFixture({
		roomId: 102,
		meetingId: 11,
		lessonId: null,
		title: '????щ떇 紐⑥엫',
	});
	const lessonRoom = { ...BASE_LESSON_ROOM, displayTitle: `${BASE_LESSON_ROOM.title} | student` };

	beforeEach(() => {
		vi.clearAllMocks();
		capturedOnNewMessage = null;
		capturedSelectedRoomId = null;
		mockUseLocation.mockReturnValue({ state: null });
		mockUseAuthStore.mockReturnValue({ userId: 46 });
		vi.mocked(getMyChatRooms).mockResolvedValue([meetingRoom1, meetingRoom2, lessonRoom]);
		vi.mocked(getRoomMessages).mockResolvedValue([
			createChatMessageFixture({ id: 1, roomId: meetingRoom1.roomId, content: 'history' }),
		]);
	});

	it('loads room messages after room selection', async () => {
		renderWithQueryClient();

		await userEvent.click(await screen.findByText(`select-${meetingRoom1.roomId}`));

		await waitFor(() => {
			expect(getRoomMessages).toHaveBeenCalledWith(meetingRoom1.roomId);
			expect(screen.getByText('history')).toBeInTheDocument();
		});
	});

	it('sends message via useChatSocket sendMessage', async () => {
		vi.mocked(getRoomMessages).mockResolvedValue([]);
		renderWithQueryClient();

		await userEvent.click(await screen.findByText(`select-${meetingRoom1.roomId}`));
		await userEvent.click(screen.getByText('fill-input'));
		await userEvent.click(screen.getByText('send'));

		expect(mockSendMessage).toHaveBeenCalledWith('hello');
	});

	it('appends new message when incoming room matches selected room', async () => {
		vi.mocked(getRoomMessages).mockResolvedValue([]);
		renderWithQueryClient();

		await userEvent.click(await screen.findByText(`select-${meetingRoom1.roomId}`));

		const incoming = createChatMessageFixture({
			id: 3,
			roomId: meetingRoom1.roomId,
			content: 'realtime-message',
		});
		await act(async () => {
			capturedOnNewMessage?.(incoming);
		});

		await waitFor(() => {
			expect(screen.getByText('realtime-message')).toBeInTheDocument();
		});
		expect(capturedSelectedRoomId).toBe(meetingRoom1.roomId);
	});

	it('shows toast error when loading messages fails', async () => {
		vi.mocked(getRoomMessages).mockRejectedValue(new Error('failed'));
		renderWithQueryClient();

		await userEvent.click(await screen.findByText(`select-${meetingRoom1.roomId}`));

		await waitFor(() => {
			expect(mockToastError).toHaveBeenCalled();
		});
	});

	it('auto selects room from location.state.roomId and loads history', async () => {
		mockUseLocation.mockReturnValue({
			state: { roomId: meetingRoom2.roomId, chatType: 'meeting' },
		});

		renderWithQueryClient();

		await waitFor(() => {
			expect(getRoomMessages).toHaveBeenCalledWith(meetingRoom2.roomId);
			expect(screen.getByTestId('selected-meeting')).toHaveTextContent(
				String(meetingRoom2.meetingId),
			);
		});
	});

	it('auto selects room from query props and loads history', async () => {
		mockUseLocation.mockReturnValue({ state: null });

		renderWithQueryClient({
			initialRoomId: meetingRoom2.roomId,
			initialChatType: 'meeting',
			initialMeetingId: meetingRoom2.meetingId,
		});

		await waitFor(() => {
			expect(getRoomMessages).toHaveBeenCalledWith(meetingRoom2.roomId);
			expect(screen.getByTestId('selected-meeting')).toHaveTextContent(
				String(meetingRoom2.meetingId),
			);
		});
	});

	it('calls refetch when roomId from route is not found in room list', async () => {
		mockUseLocation.mockReturnValue({
			state: { roomId: 9999, chatType: 'meeting' },
		});

		renderWithQueryClient();

		await waitFor(() => {
			expect(getMyChatRooms).toHaveBeenCalledTimes(2);
		});
	});

	it('does not append incoming message from different room and reorders room list', async () => {
		vi.mocked(getRoomMessages).mockResolvedValue([]);
		renderWithQueryClient();

		await userEvent.click(await screen.findByText(`select-${meetingRoom1.roomId}`));
		expect(screen.getByTestId('meeting-order')).toHaveTextContent(
			`${meetingRoom1.roomId},${meetingRoom2.roomId}`,
		);

		await act(async () => {
			capturedOnNewMessage?.(
				createChatMessageFixture({
					id: 50,
					roomId: meetingRoom2.roomId,
					content: 'other-room-message',
				}),
			);
		});

		await waitFor(() => {
			expect(screen.queryByText('other-room-message')).not.toBeInTheDocument();
			expect(screen.getByTestId('meeting-order')).toHaveTextContent(
				`${meetingRoom2.roomId},${meetingRoom1.roomId}`,
			);
		});
	});

	it('keeps message state per room type when switching tabs', async () => {
		vi.mocked(getRoomMessages).mockImplementation(async (roomId: number) => {
			if (roomId === meetingRoom1.roomId) {
				return [createChatMessageFixture({ id: 201, roomId, content: 'meeting-history' })];
			}
			if (roomId === lessonRoom.roomId) {
				return [createChatMessageFixture({ id: 202, roomId, content: 'lesson-history' })];
			}
			return [];
		});

		renderWithQueryClient();

		await userEvent.click(await screen.findByText(`select-${meetingRoom1.roomId}`));
		await waitFor(() => {
			expect(screen.getByText('meeting-history')).toBeInTheDocument();
		});

		await userEvent.click(screen.getByRole('button', { name: '클래스 채팅 문의' }));
		await userEvent.click(await screen.findByText(`select-lesson-${lessonRoom.roomId}`));
		await waitFor(() => {
			expect(screen.getByText('lesson-history')).toBeInTheDocument();
		});
	});

	it('uses displayTitle for lesson rooms when displayTitle differs from title', async () => {
		renderWithQueryClient();
		await userEvent.click(screen.getByRole('button', { name: '클래스 채팅 문의' }));

		await waitFor(() => {
			expect(screen.getByTestId('lesson-titles').textContent).toContain(
				lessonRoom.displayTitle,
			);
		});
	});
	it('switches mobile single panel from list to message and back', async () => {
		renderWithQueryClient({ initialChatType: 'meeting' });

		expect(screen.getByTestId('meeting-list-panel').className).toContain('block');
		expect(screen.getByTestId('meeting-message-panel').className).toContain('hidden');

		await userEvent.click(await screen.findByText(`select-${meetingRoom1.roomId}`));

		await waitFor(() => {
			expect(screen.getByTestId('meeting-list-panel').className).toContain('hidden');
			expect(screen.getByTestId('meeting-message-panel').className).toContain('block');
		});

		await userEvent.click(screen.getByText('back-to-list'));

		await waitFor(() => {
			expect(screen.getByTestId('meeting-list-panel').className).toContain('block');
			expect(screen.getByTestId('meeting-message-panel').className).toContain('hidden');
		});
	});
});
