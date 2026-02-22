import { createPageMetadata } from '@/utils/metadata';

import JoinedMeetingClient from './JoinedMeetingClient';

export const metadata = createPageMetadata({
	title: '참여한 모임',
	description: '참여 중인 모임 목록 페이지',
	noindex: true,
});

export default function JoinedMeetingPage() {
	return <JoinedMeetingClient />;
}
