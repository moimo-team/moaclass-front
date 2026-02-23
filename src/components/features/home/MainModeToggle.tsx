'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type MainMode = 'lesson' | 'meeting';

interface MainModeToggleProps {
	mode: MainMode;
	setMode: (mode: MainMode) => void;
}

export const MainModeToggle = ({ mode, setMode }: MainModeToggleProps) => {
	return (
		<nav
			className="w-full bg-white border-b border-gray-100 flex justify-center sticky top-[80px] z-30"
			aria-label="메인 모드 전환"
		>
			<div className="flex py-4">
				<Tabs
					value={mode}
					onValueChange={(value) => setMode(value as MainMode)}
					className="w-auto"
				>
					<TabsList className="bg-transparent gap-12 h-auto p-0">
						<TabsTrigger
							value="lesson"
							className={cn(
								'text-xl font-nanum-bold transition-all relative pb-2 px-2 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none',
								'text-gray-400 hover:text-gray-600',
							)}
						>
							원데이 클래스
							{mode === 'lesson' && (
								<div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full transition-all" />
							)}
						</TabsTrigger>
						<TabsTrigger
							value="meeting"
							className={cn(
								'text-xl font-nanum-bold transition-all relative pb-2 px-2 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none',
								'text-gray-400 hover:text-gray-600',
							)}
						>
							모임
							{mode === 'meeting' && (
								<div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full transition-all" />
							)}
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
		</nav>
	);
};

export default MainModeToggle;
