import ClassDashboardClient from '@/app/classes-manage/ClassDashboardClient';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '클래스 대시보드',
	description: '클래스 운영 관리 페이지',
	noindex: true,
});

export default function Page() {
	return <ClassDashboardClient />;
}
