import { ImageResponse } from 'next/og';

import { fetchLesson } from '@/api/lesson.api';

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
				background: '#6b8f71',
				color: '#ffffff',
				padding: 48,
				textAlign: 'center',
				gap: 16,
			}}
		>
			<div style={{ fontSize: 56, fontWeight: 800 }}>{title}</div>
			<div style={{ fontSize: 28, opacity: 0.9 }}>모아클</div>
		</div>,
		size,
	);

export default async function Image({ params }: { params: { lessonId: string } }) {
	const lessonId = Number(params.lessonId);

	if (!Number.isFinite(lessonId)) {
		return renderFallback('원데이 클래스');
	}

	try {
		const lesson = await fetchLesson(lessonId);
		const title = lesson?.title?.trim() || '원데이 클래스';
		const price =
			typeof lesson?.discountedPrice === 'number'
				? `${lesson.discountedPrice.toLocaleString('ko-KR')} 원`
				: null;

		return new ImageResponse(
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
					gap: 20,
				}}
			>
				<div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.25, maxWidth: 1000 }}>
					{title}
				</div>
				<div style={{ fontSize: 28, fontWeight: 600, opacity: 0.9 }}>
					모아클 {price ? `| ${price}` : ''}
				</div>
			</div>,
			size,
		);
	} catch {
		return renderFallback('원데이클래스');
	}
}
