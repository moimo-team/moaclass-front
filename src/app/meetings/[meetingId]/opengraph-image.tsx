import { ImageResponse } from 'next/og';

import { getMeetingById } from '@/api/meeting.api';

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = 'image/png';

const renderFallback = (title: string) =>
	new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: '#111111',
				color: '#ffffff',
				padding: 48,
				textAlign: 'center',
				gap: 16,
			}}
		>
			<div style={{ fontSize: 56, fontWeight: 800 }}>{title}</div>
			<div style={{ fontSize: 28, opacity: 0.9 }}>일일 모임</div>
		</div>,
		size,
	);

export default async function Image({ params }: { params: { meetingId: string } }) {
	const meetingId = Number(params.meetingId);

	if (!Number.isFinite(meetingId)) {
		return renderFallback('모임');
	}

	try {
		const meeting = await getMeetingById(meetingId);
		const title = meeting?.title?.trim() || '모아클래스 모임';
		const dateText = meeting?.meetingDate
			? new Date(meeting.meetingDate).toLocaleString('ko-KR')
			: null;
		const addressText = meeting?.location?.address?.trim() || null;

		return new ImageResponse(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					background: '#6b8f71',
					color: '#ffffff',
					padding: 48,
					textAlign: 'center',
					gap: 14,
				}}
			>
				<div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.25, maxWidth: 1000 }}>
					{title}
				</div>
				<div style={{ fontSize: 28, fontWeight: 600, opacity: 0.9 }}>모아클래스 모임</div>
				{dateText && <div style={{ fontSize: 24, opacity: 0.85 }}>{dateText}</div>}
				{addressText && (
					<div style={{ fontSize: 22, opacity: 0.8, maxWidth: 1000 }}>{addressText}</div>
				)}
			</div>,
			size,
		);
	} catch {
		return renderFallback('모아클래스 모암');
	}
}
