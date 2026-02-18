import { useEffect, useState } from 'react';

import { useTeacherProfileQuery } from '@/hooks/useTeacherProfileMutations';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

import ClassManagementPage from './manage/ClassManagementPage';
import TeacherProfilePage from './teacher/TeacherProfilePage';

type TabType = 'profile' | 'classes';

const ClassDashboardPage = () => {
	const userId = useAuthStore((state) => state.userId);
	const { data: teacherProfile, isLoading } = useTeacherProfileQuery(userId ?? undefined);

	// 프로필 유무에 따라 초기 탭 설정
	const [activeTab, setActiveTab] = useState<TabType>('profile');
	const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

	// 프로필 로딩 완료 후 최초 1회만 탭 자동 업데이트
	useEffect(() => {
		if (!isLoading && !isInitialCheckDone) {
			if (teacherProfile) {
				setActiveTab('classes');
			}
			setIsInitialCheckDone(true);
		}
	}, [teacherProfile, isLoading, isInitialCheckDone]);

	const tabs = [
		{ id: 'profile' as TabType, label: '모멘토 프로필' },
		{ id: 'classes' as TabType, label: '클래스 관리' },
	];

	return (
		<div className="flex min-h-screen w-full bg-white">
			{/* 좌측 사이드바 - sticky로 고정 */}
			<aside className="w-52 border-r border-gray-100 flex-shrink-0 z-20 h-screen sticky top-0 bg-white">
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
			<main className="flex-1 bg-white">
				<div className="max-w-[1400px] mx-auto p-10">
					{activeTab === 'profile' && <TeacherProfilePage userId={userId ?? undefined} />}
					{activeTab === 'classes' && <ClassManagementPage />}
				</div>
			</main>
		</div>
	);
};

export default ClassDashboardPage;
