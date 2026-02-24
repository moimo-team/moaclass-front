import { ImageResponse } from 'next/og';

import { fetchLesson } from '@/api/lesson.api';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

const BRAND_GRADIENT = 'linear-gradient(135deg, #6b8f71 0%, #4f6f5c 45%, #2b3d33 100%)';

const toPriceText = (price?: number | null) =>
	typeof price === 'number' ? `${price.toLocaleString('ko-KR')}원` : null;

const clampTitle = (title: string, max = 42) =>
	title.length > max ? `${title.slice(0, max - 1)}…` : title;

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
				<div style={{ fontSize: 26, opacity: 0.9 }}>MoaClass</div>
			</div>
		</div>,
		size,
	);

export default async function Image({ params }: { params: { lessonId: string } }) {
	const lessonId = Number(params.lessonId);
	if (!Number.isFinite(lessonId)) return renderFallback('모아클');

	try {
		const lesson = await fetchLesson(lessonId);
		const title = clampTitle(lesson?.title?.trim() || '모아클 원데이 클래스');
		const price = toPriceText(lesson?.discountedPrice ?? lesson?.price ?? null);
		const imageUrl = lesson?.representativeImage || '';
		const category = lesson?.classCategory?.name?.trim() || '원데이 클래스';

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

					<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
						<div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.2 }}>
							{title}
						</div>
						<div style={{ fontSize: 32, opacity: 0.95 }}>
							{price || '상세 페이지에서 가격 확인'}
						</div>
					</div>
				</div>
			</div>,
			size,
		);
	} catch {
		return renderFallback('모아클');
	}
}
