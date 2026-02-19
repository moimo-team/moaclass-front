import InterestsClient from '@/app/interests/InterestsClient';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '관심사 모두보기',
	description: '관심 분야별 모임을 확인해보세요.',
	canonical: '/interests',
});

export default function Page() {
	return <InterestsClient />;
}
