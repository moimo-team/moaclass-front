import { ImageResponse } from 'next/og';

import { getMeetingById } from '@/api/meeting.api';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

const BRAND_GRADIENT = 'linear-gradient(135deg, #6b8f71 0%, #4f6f5c 45%, #2b3d33 100%)';

const clampTitle = (title: string, max = 42) =>
	title.length > max ? `${title.slice(0, max - 1)}…` : title;

const toDateText = (iso?: string | null) => {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleString('ko-KR');
};

const renderFallback = (title: string) =>
	new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'flex-end',
				padding: '56px',
				background: BRAND_GRADIENT,
				color: '#fff',
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
				<div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2 }}>{title}</div>
				<div style={{ fontSize: 26, opacity: 0.9 }}>MoaClass 모임</div>
			</div>
		</div>,
		size,
	);

export default async function Image({ params }: { params: { meetingId: string } }) {
	const meetingId = Number(params.meetingId);
	if (!Number.isFinite(meetingId)) return renderFallback('모아클 모임');

	try {
		const meeting = await getMeetingById(meetingId);
		const title = clampTitle(meeting?.title?.trim() || '모아클 모임');
		const dateText = toDateText(meeting?.meetingDate);
		const addressText = meeting?.location?.address?.trim() || null;
		const imageUrl = meeting?.meetingImage || '';
		const category = meeting?.interestName?.trim() || '모임';

		return new ImageResponse(
			<div
				style={{
					width: '100%',
					height: '100%',
					position: 'relative',
					display: 'flex',
					color: '#fff',
					overflow: 'hidden',
					background: BRAND_GRADIENT,
				}}
			>
				{imageUrl ? (
					<img
						src={imageUrl}
						alt=""
						style={{
							position: 'absolute',
							inset: 0,
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				) : null}

				<div
					style={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(180deg, rgba(43,61,51,0.22) 0%, rgba(43,61,51,0.68) 70%, rgba(43,61,51,0.86) 100%)',
					}}
				/>

				<div
					style={{
						position: 'relative',
						zIndex: 1,
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						padding: '56px',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<div style={{ fontSize: 26, opacity: 0.95, fontWeight: 700 }}>MoaClass</div>
						<div
							style={{
								fontSize: 22,
								padding: '8px 16px',
								borderRadius: 999,
								background: 'rgba(255,255,255,0.2)',
							}}
						>
							{category}
						</div>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
						<div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.2 }}>
							{title}
						</div>
						{dateText && <div style={{ fontSize: 30, opacity: 0.95 }}>{dateText}</div>}
						{addressText && (
							<div style={{ fontSize: 24, opacity: 0.9, maxWidth: 1000 }}>
								{addressText}
							</div>
						)}
					</div>
				</div>
			</div>,
			size,
		);
	} catch {
		return renderFallback('모아클 모임');
	}
}
