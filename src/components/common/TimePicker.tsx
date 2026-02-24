import { useEffect, useRef, useState } from 'react';

import { Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimePickerProps {
	value: string; // HH:mm
	onChange: (value: string) => void;
	label?: string;
	className?: string;
	error?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '10', '20', '30', '40', '50'];

export const TimePicker = ({ value, onChange, label, className, error }: TimePickerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedH, setSelectedH] = useState(value?.split(':')[0] || '09');
	const [selectedM, setSelectedM] = useState(value?.split(':')[1] || '00');

	const hScrollRef = useRef<HTMLDivElement>(null);
	const mScrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (value) {
			const [h, m] = value.split(':');
			setSelectedH(h);
			setSelectedM(m);
		}
	}, [value]);

	// Auto-scroll to selected items when popover opens
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				const hEl = hScrollRef.current?.querySelector(`[data-value="${selectedH}"]`);
				const mEl = mScrollRef.current?.querySelector(`[data-value="${selectedM}"]`);
				hEl?.scrollIntoView({ block: 'center' });
				mEl?.scrollIntoView({ block: 'center' });
			}, 0);
		}
	}, [isOpen, selectedH, selectedM]);

	const handleHSelect = (h: string) => {
		setSelectedH(h);
		onChange(`${h}:${selectedM}`);
	};

	const handleMSelect = (m: string) => {
		setSelectedM(m);
		onChange(`${selectedH}:${m}`);
	};

	return (
		<div className={cn('space-y-2 flex-1', className)}>
			{label && <label className="text-sm font-bold text-gray-700">{label}</label>}

			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							'w-full h-12 justify-between text-left font-bold border-gray-200 rounded-lg hover:bg-gray-50 transition-all focus-visible:ring-primary/30',
							!value && 'text-muted-foreground',
							error && 'border-red-500 bg-red-50/5',
						)}
					>
						<span className="flex items-center gap-2">
							<Clock
								className={cn(
									'w-4 h-4 transition-colors',
									value ? 'text-primary' : 'text-gray-400',
								)}
							/>
							{value || '시간 선택'}
						</span>
					</Button>
				</PopoverTrigger>

				<PopoverContent
					className="w-[var(--radix-popover-trigger-width)] p-0 border-none shadow-2xl rounded-2xl bg-white overflow-hidden pointer-events-auto"
					align="start"
					sideOffset={8}
					onOpenAutoFocus={(e) => e.preventDefault()} // Prevent stealing focus too aggressively
				>
					<div className="flex bg-white">
						{/* Hour Column */}
						<div className="flex-1 flex flex-col pt-3 pb-2 border-r border-gray-50 min-w-0">
							<p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-tight text-center select-none">
								시
							</p>
							<div
								ref={hScrollRef}
								className="h-[240px] overflow-y-auto px-2 space-y-1 scrollbar-thin overscroll-contain focus:outline-none"
								onWheel={(e) => e.stopPropagation()}
								tabIndex={-1}
							>
								{HOURS.map((h) => (
									<button
										key={h}
										data-value={h}
										type="button"
										onClick={() => handleHSelect(h)}
										className={cn(
											'w-full h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all shrink-0',
											selectedH === h
												? 'bg-primary text-white shadow-sm'
												: 'text-gray-400 hover:bg-gray-50 hover:text-gray-700',
										)}
									>
										{h}
									</button>
								))}
							</div>
						</div>

						{/* Minute Column */}
						<div className="flex-1 flex flex-col pt-3 pb-2 min-w-0">
							<p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-tight text-center select-none">
								분
							</p>
							<div
								ref={mScrollRef}
								className="h-[240px] overflow-y-auto px-2 space-y-1 scrollbar-thin overscroll-contain focus:outline-none"
								onWheel={(e) => e.stopPropagation()}
								tabIndex={-1}
							>
								{MINUTES.map((m) => (
									<button
										key={m}
										data-value={m}
										type="button"
										onClick={() => handleMSelect(m)}
										className={cn(
											'w-full h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all shrink-0',
											selectedM === m
												? 'bg-primary text-white shadow-sm'
												: 'text-gray-400 hover:bg-gray-50 hover:text-gray-700',
										)}
									>
										{m}
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="p-3 bg-gray-50/50 border-t border-gray-50 flex justify-end">
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90 text-white px-5 h-8 rounded-lg text-xs font-black shadow-md border-none"
							onClick={() => setIsOpen(false)}
						>
							확인
						</Button>
					</div>
				</PopoverContent>
			</Popover>

			{error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}

			<style jsx global>{`
				.scrollbar-thin::-webkit-scrollbar {
					width: 4px;
				}
				.scrollbar-thin::-webkit-scrollbar-track {
					background: transparent;
				}
				.scrollbar-thin::-webkit-scrollbar-thumb {
					background: #f3f4f6;
					border-radius: 10px;
				}
				.scrollbar-thin::-webkit-scrollbar-thumb:hover {
					background: #e5e7eb;
				}
			`}</style>
		</div>
	);
};
