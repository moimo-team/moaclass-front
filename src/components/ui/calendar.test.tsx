import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Calendar } from './calendar';

describe('Calendar', () => {
	it('hasSchedule modifier가 있으면 해당 날짜 버튼에 data-has-schedule=true가 적용된다', () => {
		render(
			<Calendar
				mode="single"
				month={new Date(2026, 2, 1)}
				modifiers={{
					hasSchedule: (date) =>
						date.getFullYear() === 2026 &&
						date.getMonth() === 2 &&
						date.getDate() === 15,
				}}
			/>,
		);

		const highlightedDates = document.querySelectorAll('button[data-has-schedule="true"]');
		expect(highlightedDates.length).toBeGreaterThan(0);
	});

	it('disabled 날짜도 data-has-schedule 속성은 유지된다', () => {
		render(
			<Calendar
				mode="single"
				month={new Date(2026, 2, 1)}
				modifiers={{
					hasSchedule: (date) =>
						date.getFullYear() === 2026 &&
						date.getMonth() === 2 &&
						date.getDate() === 15,
				}}
				disabled={(date) =>
					date.getFullYear() === 2026 && date.getMonth() === 2 && date.getDate() === 15
				}
			/>,
		);

		const highlightedDates = document.querySelectorAll('button[data-has-schedule="true"]');
		expect(highlightedDates.length).toBeGreaterThan(0);
	});
});
