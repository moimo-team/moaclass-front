import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Schedule } from '@/models/schedule.model';

import { LessonReservationSidebar } from './LessonReservationSidebar';

type CalendarProps = {
	modifiers?: {
		hasSchedule?: (date: Date) => boolean;
	};
	onSelect?: (date: Date | undefined) => void;
};

let latestCalendarProps: CalendarProps | null = null;

vi.mock('@/components/ui/calendar', () => ({
	Calendar: (props: CalendarProps) => {
		latestCalendarProps = props;
		return <div data-testid="calendar-mock" />;
	},
}));

vi.mock('@/components/ui/popover', () => ({
	Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const baseSchedules: Schedule[] = [
	{
		id: 1,
		startAt: '2026-03-15T10:00:00',
		endAt: '2026-03-15T12:00:00',
		status: 'RECRUITING',
		currentParticipants: 1,
	},
	{
		id: 2,
		startAt: '2026-03-16T10:00:00',
		endAt: '2026-03-16T12:00:00',
		status: 'CLOSED',
		currentParticipants: 2,
	},
];

const buildProps = (schedules: Schedule[]) => ({
	reservationLeadDays: 1,
	price: 10000,
	discountRate: 0,
	discountedPrice: 10000,
	isLoggedIn: true,
	today: new Date('2026-03-01T00:00:00'),
	threeMonthsLater: new Date('2026-06-01T00:00:00'),
	schedules,
	onWishlistToggle: vi.fn(),
	onInquiry: vi.fn(),
	onApplyLesson: vi.fn(),
	showLoginPrompt: vi.fn(),
	maxParticipants: 8,
	isLiked: false,
	isOwnedByCurrentUser: false,
});

describe('LessonReservationSidebar', () => {
	it('disables headcount controls before schedule selection', () => {
		render(<LessonReservationSidebar {...buildProps(baseSchedules)} />);

		expect(screen.getByRole('button', { name: '+' })).toBeDisabled();
		expect(screen.getByRole('button', { name: '-' })).toBeDisabled();
		expect(screen.getByText('먼저 시간대를 선택해주세요.')).toBeInTheDocument();
	});

	it('marks only RECRUITING dates as hasSchedule', () => {
		render(<LessonReservationSidebar {...buildProps(baseSchedules)} />);

		expect(latestCalendarProps?.modifiers?.hasSchedule?.(new Date(2026, 2, 15))).toBe(true);
		expect(latestCalendarProps?.modifiers?.hasSchedule?.(new Date(2026, 2, 16))).toBe(false);
	});

	it('renders schedule list for selected date', () => {
		render(<LessonReservationSidebar {...buildProps(baseSchedules)} />);

		act(() => {
			latestCalendarProps?.onSelect?.(new Date(2026, 2, 15));
		});

		expect(screen.getByText(/10:00/)).toBeInTheDocument();
		expect(screen.getByText(/12:00/)).toBeInTheDocument();
	});

	it('allows up to 8 headcount when remaining slots are 8', async () => {
		const user = userEvent.setup();
		const schedules: Schedule[] = [
			{
				id: 10,
				startAt: '2026-03-15T10:00:00',
				endAt: '2026-03-15T12:00:00',
				status: 'RECRUITING',
				currentParticipants: 0,
			},
		];

		render(<LessonReservationSidebar {...buildProps(schedules)} />);

		act(() => {
			latestCalendarProps?.onSelect?.(new Date(2026, 2, 15));
		});

		await user.click(screen.getByRole('button', { name: /10:00/ }));
		const plusButton = screen.getByRole('button', { name: '+' });

		for (let i = 0; i < 7; i += 1) {
			await user.click(plusButton);
		}

		expect(screen.getByDisplayValue('8')).toBeInTheDocument();
		expect(plusButton).toBeDisabled();
	});

	it('allows up to 3 headcount when remaining slots are 3', async () => {
		const user = userEvent.setup();
		const schedules: Schedule[] = [
			{
				id: 11,
				startAt: '2026-03-15T10:00:00',
				endAt: '2026-03-15T12:00:00',
				status: 'RECRUITING',
				currentParticipants: 5,
			},
		];

		render(<LessonReservationSidebar {...buildProps(schedules)} />);

		act(() => {
			latestCalendarProps?.onSelect?.(new Date(2026, 2, 15));
		});

		await user.click(screen.getByRole('button', { name: /10:00/ }));
		const plusButton = screen.getByRole('button', { name: '+' });

		await user.click(plusButton);
		await user.click(plusButton);

		expect(screen.getByDisplayValue('3')).toBeInTheDocument();
		expect(plusButton).toBeDisabled();
	});

	it('clamps headcount when switching to a schedule with fewer remaining slots', async () => {
		const user = userEvent.setup();
		const schedules: Schedule[] = [
			{
				id: 21,
				startAt: '2026-03-15T10:00:00',
				endAt: '2026-03-15T11:00:00',
				status: 'RECRUITING',
				currentParticipants: 0,
			},
			{
				id: 22,
				startAt: '2026-03-15T12:00:00',
				endAt: '2026-03-15T13:00:00',
				status: 'RECRUITING',
				currentParticipants: 5,
			},
		];

		render(<LessonReservationSidebar {...buildProps(schedules)} />);

		act(() => {
			latestCalendarProps?.onSelect?.(new Date(2026, 2, 15));
		});

		await user.click(screen.getByRole('button', { name: /10:00/ }));
		const plusButton = screen.getByRole('button', { name: '+' });
		for (let i = 0; i < 7; i += 1) {
			await user.click(plusButton);
		}
		expect(screen.getByDisplayValue('8')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /12:00/ }));
		expect(screen.getByDisplayValue('3')).toBeInTheDocument();
	});

	it('disables sold-out schedules and applies sold-out styles', () => {
		const schedules: Schedule[] = [
			{
				id: 31,
				startAt: '2026-03-15T10:00:00',
				endAt: '2026-03-15T12:00:00',
				status: 'RECRUITING',
				currentParticipants: 8,
			},
		];

		render(<LessonReservationSidebar {...buildProps(schedules)} />);

		act(() => {
			latestCalendarProps?.onSelect?.(new Date(2026, 2, 15));
		});

		const soldOutButton = screen.getByRole('button', { name: /10:00/ });
		expect(soldOutButton).toBeDisabled();
		expect(soldOutButton.className).toContain('bg-secondary/40');

		const headcountText = screen.getByText('8 / 8명');
		expect(headcountText.className).toContain('text-destructive');
	});
});
