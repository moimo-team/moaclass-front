import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';

interface PointCouponInfoProps<T extends string> {
	title: string;
	value: number;
	unit: string;
	tabs: readonly T[];
	activeTab: T;
	onTabChange: (tab: T) => void;
}

export const PointCouponInfo = <T extends string>({
	title,
	value,
	unit,
	tabs,
	activeTab,
	onTabChange,
}: PointCouponInfoProps<T>) => {
	return (
		<Card className="bg-[#dfece3] border-none shadow-none rounded-3xl overflow-hidden relative pb-14">
			<CardContent className="pt-8 px-8 flex flex-col items-start gap-8">
				<h2 className="text-xl font-extrabold text-[#2f2f2f] tracking-tight">{title}</h2>
				<div className="w-full flex justify-end items-baseline gap-2 mt-4 bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
					<span className="text-4xl font-black text-[#2f2f2f]">
						{value.toLocaleString()}
					</span>
					<span className="text-2xl font-bold text-[#2f2f2f]">{unit}</span>
				</div>
			</CardContent>

			{/* 탭 시스템 */}
			<div className="absolute bottom-0 left-0 w-full flex border-t border-black/10 bg-[#dfece3]/50 backdrop-blur-sm">
				{tabs.map((tab, index) => (
					<button
						key={tab}
						onClick={() => onTabChange(tab)}
						className={`flex-1 py-4 text-[15px] font-bold transition-all relative ${
							activeTab === tab ? 'text-black' : 'text-black/40'
						}`}
					>
						{tab}
						{activeTab === tab && (
							<motion.div
								layoutId="activeTabUnderline"
								className="absolute bottom-0 left-0 w-full h-1 bg-[#6b8f71]"
							/>
						)}
						{index !== tabs.length - 1 && (
							<div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-6 bg-black/10" />
						)}
					</button>
				))}
			</div>
		</Card>
	);
};
