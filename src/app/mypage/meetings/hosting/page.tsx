import { createPageMetadata } from '@/utils/metadata';

import HostMeetingClient from './HostMeetingClient';

export const metadata = createPageMetadata({
	title: '내 모임 관리',
	description: '개설한 모임 관리 페이지',
	noindex: true,
});

export default function HostMeetingPage() {
	return <HostMeetingClient />;
}
