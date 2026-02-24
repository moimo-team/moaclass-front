import { useMemo } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';

import { useTeacherProfileQuery } from '@/hooks/useTeacherProfileMutations';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

import { ClassManagementContent } from './manage/ClassManagementPage';
import TeacherProfilePage from './teacher/TeacherProfilePage';

type TabType = 'profile' | 'classes';

export const ClassDashboardContent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const userId = useAuthStore((state) => state.userId);
	const { data: teacherProfile, isLoading } = useTeacherProfileQuery(userId ?? undefined);

	// URL 파라미터에서 현재 탭 가져오기 (기본값: 'classes')
	// 프로필이 로딩된 후 프로필이 없는 경우 강제로 'profile' 탭으로 간주 (등록 유도)
	const activeTab = useMemo(() => {
		const tabParam = searchParams.get('tab') as TabType;
		if (!isLoading && !teacherProfile) return 'profile';
		return tabParam || 'classes';
	}, [searchParams, teacherProfile, isLoading]);

	const setActiveTab = (tab: TabType) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('tab', tab);
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const tabs = [
		{ id: 'profile' as TabType, label: '모멘토 프로필' },
		{ id: 'classes' as TabType, label: '클래스 관리' },
	];

	return (
		<div className="flex min-h-screen w-full bg-white">
			{/* 좌측 사이드바 - sticky로 고정 */}
			<aside className="w-52 border-r border-gray-100 shrink-0 z-20 h-screen sticky top-0 bg-white">
				<div className="p-8">
					<h1 className="text-3xl font-bold text-gray-900 tracking-tight">클래스</h1>
					<h1 className="text-3xl font-bold text-gray-900 tracking-tight">대시보드</h1>
				</div>
				<nav className="px-4">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								'w-full text-left px-5 py-3.5 rounded-xl mb-2 transition-all font-semibold text-sm',
								activeTab === tab.id
									? 'bg-primary text-white shadow-md shadow-primary/20'
									: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
							)}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</aside>

			{/* 우측 컨텐츠 영역 - 브라우저 전체 스크롤 사용 */}
			<section className="flex-1 bg-white" aria-label="클래스 대시보드 콘텐츠">
				<div className="w-full mx-auto">
					{activeTab === 'profile' && <TeacherProfilePage />}
					{activeTab === 'classes' && <ClassManagementContent />}
				</div>
			</section>
		</div>
	);
};

const ClassDashboardPage = () => {
	return <ClassDashboardContent />;
};

export default ClassDashboardPage;
