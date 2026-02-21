import { createPageMetadata } from '@/utils/metadata';

import ParticipationsClient from '../participants/ParticipationsClient';

export const metadata = createPageMetadata({
	title: '모임 참여 요청 관리',
	description: '모임 참여 요청 관리 페이지',
	noindex: true,
});

export default function ParticipationsPage() {
	return <ParticipationsClient />;
}
