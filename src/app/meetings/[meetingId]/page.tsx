import { getMeetingById } from '@/api/meeting.api';
import { createPageMetadata } from '@/utils/metadata';

import MeetingDetailClient from './MeetingDetailClient';

import type { Metadata } from 'next';

type Props = {
	params: Promise<{ meetingId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { meetingId } = await params;
	const id = Number(meetingId);

	if (!Number.isFinite(id)) {
		return createPageMetadata({
			title: '모임을 찾을 수 없습니다',
			description: '유효하지 않은 모임 경로입니다.',
			noindex: true,
		});
	}

	try {
		const meeting = await getMeetingById(id);

		return createPageMetadata({
			title: meeting.title,
			description: meeting.description || '모아클래스 모임 상세 페이지입니다.',
			image: meeting.meetingImage,
			canonical: `/meetings/${id}`,
		});
	} catch {
		return createPageMetadata({
			title: '모임을 찾을 수 없습니다',
			description: '요청한 모임을 찾지 못했습니다.',
			noindex: true,
		});
	}
}

export default async function MeetingDetailPage() {
	return <MeetingDetailClient />;
}
