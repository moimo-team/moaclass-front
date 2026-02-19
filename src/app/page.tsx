import HomeClient from '@/app/HomeClient';
import { createPageMetadata } from '@/utils/metadata';

// 메타 데이터 적용
export const metadata = createPageMetadata({
	title: '홈',
	description: '모아클래스에서 다양한 강의를 만나보세요.',
	canonical: '/',
});

export default function Page() {
	return <HomeClient />;
}
