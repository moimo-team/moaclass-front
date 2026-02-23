'use client';

import { useCallback, useState } from 'react';

import { Menu } from 'lucide-react';

import ProtectedRoute from '@/components/common/protected/ProtectedRoute';
import { MypageSidebar } from '@/components/features/mypage/MypageSidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MypageLayout = ({ children }: { children: React.ReactNode }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// 모바일 사이드바 오픈 함수 메모이제이션
	const handleMenuItemClick = useCallback(() => {
		setIsSidebarOpen(false);
	}, []);

	return (
		<ProtectedRoute>
			<div className="flex w-full flex-col lg:flex-row flex-1 bg-background">
				{/* Mobile Header - 화면 너비 1024px 미만일 때 표시 (lg:hidden) */}
				<div className="lg:hidden p-4 border-b flex items-center bg-white sticky top-0 z-10">
					<Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="-ml-2">
								<Menu className="h-6 w-6" />
								<span className="sr-only">메뉴 열기</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0 w-[300px]">
							{/* 모바일 사이드바에서 메뉴 클릭 시 시트 닫기 */}
							<MypageSidebar onMenuItemClick={handleMenuItemClick} />
						</SheetContent>
					</Sheet>
					<h1 className="ml-2 font-bold text-lg">마이페이지</h1>
				</div>

				{/* Desktop leftSidebar - 마이페이지바 (LG 이상에서만 보임) */}
				<div className="hidden lg:flex w-[280px] shrink-0 flex-col overflow-hidden">
					<MypageSidebar />
				</div>

				{/* 메인 영역 - 스크롤 가능하도록 설정 */}
				<div className="flex flex-col overflow-hidden flex-1 p-4 lg:p-0 lg:pl-12">
					{children}
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default MypageLayout;
