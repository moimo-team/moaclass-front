'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoIosSearch } from 'react-icons/io';

import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { ProfileDropdown } from '@/components/common/ProfileDropdown';
import LessonFilterSection from '@/components/features/lessons/LessonFilterSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useFilterStore } from '@/store/filterStore';
import { buildLessonFilterSearchParams } from '@/utils/lessonFilterQuery';

function Header() {
	const { isLoggedIn } = useAuthStore();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [searchTopic, setSearchTopic] = useState('');
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const headerRef = useRef<HTMLElement | null>(null);
	const filterPanelRef = useRef<HTMLDivElement | null>(null);

	const filterStore = useFilterStore();

	const handleTextSearch = (event: React.FormEvent) => {
		event.preventDefault();
		if (!searchTopic.trim()) return;

		const params = new URLSearchParams(searchParams.toString());
		params.set('keyword', searchTopic.trim());
		params.set('page', '1');
		router.push(`/lessons?${params.toString()}`);
		setIsFilterOpen(false);
	};

	const handleFilterSearch = () => {
		const params = buildLessonFilterSearchParams(filterStore.getFetchLessonsParams());
		const currentKeyword = searchParams.get('keyword');
		const currentLimit = searchParams.get('limit');
		if (!params.has('keyword') && currentKeyword) {
			params.set('keyword', currentKeyword);
		}
		if (!params.has('limit') && currentLimit) {
			params.set('limit', currentLimit);
		}
		const queryString = params.toString();
		router.push(queryString ? `/lessons?${queryString}` : '/lessons');
		setIsFilterOpen(false);
	};

	const handleInputFocus = () => setIsFilterOpen(true);
	const handleCloseFilter = () => setIsFilterOpen(false);

	useEffect(() => {
		if (!isFilterOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

			const isInsideAllowedArea = path.some((node) => {
				if (!(node instanceof Node)) return false;

				if (headerRef.current?.contains(node)) return true;
				if (filterPanelRef.current?.contains(node)) return true;

				return (
					node instanceof Element &&
					Boolean(node.closest('[data-filter-interactive-layer="true"]'))
				);
			});

			if (isInsideAllowedArea) {
				return;
			}

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
				<div
					ref={filterPanelRef}
					className="absolute top-[80px] left-0 right-0 z-40 bg-card shadow-lg"
				>
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
