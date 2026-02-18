import Script from 'next/script';

import Footer from '@/components/common/Footer';
import HeaderNext from '@/components/common/next/HeaderNext';
import Providers from '@/components/providers/Providers';

import type { Metadata, Viewport } from 'next';
import '@/index.css';

/**
 * Next.js Root Layout
 * - 기존 index.html의 설정을 담고 있습니다.
 * - Vite 환경과 충돌하지 않도록 src/app 내부에 위치합니다.
 */
export const metadata: Metadata = {
	title: '모아클 | MOACLASS',
	description: '모아클 - 모여라 아! 이거다 싶은 클래스',
	icons: {
		icon: '/moaclass-icon.svg',
	},
	openGraph: {
		type: 'website',
		locale: 'ko_KR',
		siteName: '모아클',
		images: [
			{
				url: '/moaclass-icon.svg', // 기본 OG 이미지(추후 변경)
				width: 1200,
				height: 630,
				alt: '모아클 - 모여라 아! 이거다 싶은 클래스',
			},
		],
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<head>
				{/* 네이버 나눔스퀘어 폰트 임포트 (기존 index.html 방식 유지) */}
				<link
					href="https://hangeul.pstatic.net/hangeul_static/css/nanum-square.css"
					rel="stylesheet"
				/>
			</head>
			<body>
				<div id="root">
					<Providers>
						<div className="flex flex-col min-h-screen">
							<HeaderNext />
							<main className="flex-1 flex flex-col w-full px-4 md:px-32">
								{children}
							</main>
							<Footer />
						</div>
					</Providers>
				</div>

				{/* 카카오맵 SDK 로드 (Next.js 최적화 방식) */}
				<Script
					strategy="beforeInteractive"
					src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`}
				/>
			</body>
		</html>
	);
}
