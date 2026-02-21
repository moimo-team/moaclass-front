import { createPageMetadata } from '@/utils/metadata';

import ParticipationsClient from './ParticipationsClient';

export const metadata = createPageMetadata({
	title: '모임 참가자 관리',
	description: '모임 참가자 관리 페이지',
	noindex: true,
});

export default function ParticipationsPage() {
	return <ParticipationsClient />;
}
