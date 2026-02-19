import ClassDashboardClient from '@/app/lessons/manage/ClassDashboardClient';
import TeacherProtectedRouteNext from '@/components/common/next/TeacherProtectedRouteNext';

import type { Metadata } from 'next';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 * 모멘토 전용 대시보드이므로 인덱싱 차단(noindex) 설정을 권장합니다.
 */
export const metadata: Metadata = {
	title: '클래스 대시보드 | 모아클',
	robots: { index: false, follow: false },
};

export default function Page() {
	return (
		<TeacherProtectedRouteNext>
			<ClassDashboardClient />
		</TeacherProtectedRouteNext>
	);
}
