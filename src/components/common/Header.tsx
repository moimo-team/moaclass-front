'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoIosSearch } from 'react-icons/io';

import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { ProfileDropdown } from '@/components/common/ProfileDropdown';
import LessonFilterSection from '@/components/features/lessons/LessonFilterSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useFilterStore } from '@/store/filterStore';

function Header() {
	const { isLoggedIn } = useAuthStore();
	const router = useRouter();

	const [searchTopic, setSearchTopic] = useState('');
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const headerRef = useRef<HTMLElement | null>(null);

	const filterStore = useFilterStore();

	const handleTextSearch = (event: React.FormEvent) => {
		event.preventDefault();
		if (!searchTopic.trim()) return;

		router.push(`/lessons?keyword=${encodeURIComponent(searchTopic)}`);
		setIsFilterOpen(false);
	};

	const handleFilterSearch = () => {
		const params = new URLSearchParams();

		if (
			filterStore.selectedRegions.length > 0 &&
			!filterStore.selectedRegions.includes('전체')
		) {
			params.append('regions', filterStore.selectedRegions.join(','));
		}

		if (filterStore.selectedCategories.length > 0) {
			params.append('categories', filterStore.selectedCategories.join(','));
		}

		if (filterStore.selectedDays.length > 0) {
			params.append('days', filterStore.selectedDays.join(','));
		}

		if (filterStore.selectedDifficulty.length > 0) {
			params.append('difficulty', filterStore.selectedDifficulty.join(','));
		}

		if (filterStore.selectedPersonnel) {
			const personnel = filterStore.selectedPersonnel.replace(/\D/g, '');
			if (personnel) params.append('personnel', personnel);
		}

		if (filterStore.timeRange[0] > 0 || filterStore.timeRange[1] < 24) {
			params.append('minTime', String(filterStore.timeRange[0]));
			params.append('maxTime', String(filterStore.timeRange[1]));
		}

		if (filterStore.priceRange[0] > 0 || filterStore.priceRange[1] < 500000) {
			params.append('minPrice', String(filterStore.priceRange[0]));
			params.append('maxPrice', String(filterStore.priceRange[1]));
		}

		router.push(`/lessons?${params.toString()}`);
		setIsFilterOpen(false);
	};

	const handleInputFocus = () => setIsFilterOpen(true);
	const handleCloseFilter = () => setIsFilterOpen(false);

	useEffect(() => {
		if (!isFilterOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node | null;
			if (!target) return;
			if (headerRef.current?.contains(target)) return;
			setIsFilterOpen(false);
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isFilterOpen]);

	return (
		<header
			ref={headerRef}
			className="w-full h-[80px] bg-card sticky top-0 z-50 shrink-0 border-b border-gray-300"
		>
			<div className="flex items-center w-full h-full max-w-7xl mx-auto px-4 md:px-8">
				<Button
					asChild
					size="lg"
					variant="ghost"
					className="cursor-pointer hover:bg-medium font-bold text-2xl p-0"
				>
					<Link href="/">모아클</Link>
				</Button>

				<form onSubmit={handleTextSearch} className="relative ml-8 w-full max-w-xs">
					<Input
						type="text"
						placeholder="관심있는 클래스 제목을 검색해 보세요"
						className="pl-4 h-11 flex-1 bg-card"
						value={searchTopic}
						onChange={(e) => setSearchTopic(e.target.value)}
						onFocus={handleInputFocus}
					/>
					<Button
						type="submit"
						size="icon"
						variant="ghost"
						className="absolute right-1 top-1/2 -translate-y-1/2"
					>
						<IoIosSearch size={24} />
					</Button>
				</form>

				<nav aria-label="주요 메뉴" className="ml-auto">
					{isLoggedIn ? (
						<div className="flex items-center gap-3 md:gap-4">
							<Button
								asChild
								size="default"
								variant="ghost"
								className="cursor-pointer hover:bg-medium text-base border border-gray-300"
							>
								<Link href="/classes-manage">클래스 관리</Link>
							</Button>
							<NotificationDropdown />
							<ProfileDropdown />
						</div>
					) : (
						<div className="login">
							<Button
								asChild
								size="default"
								variant="ghost"
								className="cursor-pointer hover:bg-medium text-base"
							>
								<Link href="/login">로그인</Link>
							</Button>
						</div>
					)}
				</nav>
			</div>

			{isFilterOpen && (
				<div className="absolute top-[80px] left-0 right-0 z-40 bg-card shadow-lg">
					<LessonFilterSection
						onClose={handleCloseFilter}
						onSearch={handleFilterSearch}
					/>
				</div>
			)}
		</header>
	);
}

export default Header;
