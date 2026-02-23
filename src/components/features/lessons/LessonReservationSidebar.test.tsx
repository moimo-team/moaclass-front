import { act, render, screen } from '@testing-library/react';
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

describe('LessonReservationSidebar', () => {
	it('RECRUITING 일정 날짜만 hasSchedule로 표시한다', () => {
		render(
			<LessonReservationSidebar
				reservationLeadDays={1}
				price={10000}
				discountRate={0}
				discountedPrice={10000}
				isLoggedIn={true}
				today={new Date('2026-03-01T00:00:00')}
				threeMonthsLater={new Date('2026-06-01T00:00:00')}
				schedules={baseSchedules}
				onWishlistToggle={vi.fn()}
				onInquiry={vi.fn()}
				onApplyLesson={vi.fn()}
				showLoginPrompt={vi.fn()}
				maxParticipants={10}
				isLiked={false}
			/>,
		);

		expect(latestCalendarProps?.modifiers?.hasSchedule?.(new Date(2026, 2, 15))).toBe(true);
		expect(latestCalendarProps?.modifiers?.hasSchedule?.(new Date(2026, 2, 16))).toBe(false);
	});

	it('날짜 선택 시 해당 날짜 시간 목록이 렌더링된다', () => {
		render(
			<LessonReservationSidebar
				reservationLeadDays={1}
				price={10000}
				discountRate={0}
				discountedPrice={10000}
				isLoggedIn={true}
				today={new Date('2026-03-01T00:00:00')}
				threeMonthsLater={new Date('2026-06-01T00:00:00')}
				schedules={baseSchedules}
				onWishlistToggle={vi.fn()}
				onInquiry={vi.fn()}
				onApplyLesson={vi.fn()}
				showLoginPrompt={vi.fn()}
				maxParticipants={10}
				isLiked={false}
			/>,
		);

		act(() => {
			latestCalendarProps?.onSelect?.(new Date(2026, 2, 15));
		});

		expect(screen.getByText(/10:00/)).toBeInTheDocument();
		expect(screen.getByText(/12:00/)).toBeInTheDocument();
	});
});
