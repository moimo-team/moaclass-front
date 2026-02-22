import { getMeetingById } from '@/api/meeting.api';
import { toAbsoluteUrl } from '@/constants/site';
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

export default async function MeetingDetailPage({ params }: Props) {
	const { meetingId } = await params;
	const id = Number(meetingId);
	let meetingJsonLd: Record<string, unknown> | null = null;

	if (Number.isFinite(id)) {
		try {
			const meeting = await getMeetingById(id);
			meetingJsonLd = {
				'@context': 'https://schema.org',
				'@type': 'Event',
				name: meeting.title,
				description: meeting.description || '모아클래스 모임 상세 페이지',
				startDate: meeting.meetingDate,
				eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
				eventStatus: 'https://schema.org/EventScheduled',
				image: meeting.meetingImage ? [meeting.meetingImage] : undefined,
				location: {
					'@type': 'Place',
					name: meeting.location?.address || '모임 장소',
					address: meeting.location?.address || '',
				},
				organizer: {
					'@type': 'Organization',
					name: '모아클래스',
					url: toAbsoluteUrl('/'),
				},
				url: toAbsoluteUrl(`/meetings/${id}`),
			};
		} catch {
			meetingJsonLd = null;
		}
	}

	return (
		<>
			{meetingJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(meetingJsonLd) }}
				/>
			)}
			<MeetingDetailClient />
		</>
	);
}
