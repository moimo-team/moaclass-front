import MoimerIntroClient from '@/app/moimer-intro/MoimerIntroClient';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '모이머 안내',
	description: '모이머 신청하고 나만의 모임을 만들어보세요.',
	canonical: '/moimer-intro',
});

export default function Page() {
	return <MoimerIntroClient />;
}
