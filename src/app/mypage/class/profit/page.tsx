import { createPageMetadata } from '@/utils/metadata';

import TeacherProfitClient from './TeacherProfitClient';

export const metadata = createPageMetadata({
	title: '수익 관리',
	description: '클래스 수익 관리 페이지',
	noindex: true,
});

export default function TeacherProfitPage() {
	return <TeacherProfitClient />;
}
