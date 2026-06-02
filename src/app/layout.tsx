import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import ScrollToTop from '@/components/common/ScrollToTop';
import Providers from '@/components/providers/Providers';
import { SITE_URL } from '@/constants/site';

import type { Metadata, Viewport } from 'next';

import '@/index.css';

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: '모아클래스',
		template: '%s | 모아클래스',
	},
	description: '모아클래스 - 모여라! 이거다 싶은 클래스',
	icons: {
		icon: ['/favicon.ico', '/moaclass-icon.svg'],
		shortcut: '/favicon.ico',
		apple: '/moaclass-icon.svg',
	},
	openGraph: {
		type: 'website',
		locale: 'ko_KR',
		siteName: '모아클래스',
		url: SITE_URL,
		title: '모아클래스',
		description: '모아클래스 - 모여라! 이거다 싶은 클래스',
		images: [
			{
				url: '/og/og-home.png',
				width: 1200,
				height: 630,
				alt: '모아클래스 기본 공유 이미지',
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
				<link
					href="https://hangeul.pstatic.net/hangeul_static/css/nanum-square.css"
					rel="stylesheet"
				/>
			</head>
			<body>
				<div id="root">
					<Providers>
						<ScrollToTop />
						<div className="flex flex-col min-h-screen">
							<Header />
							<main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-8">
								{children}
							</main>
							<Footer />
						</div>
					</Providers>
				</div>

				<Script
					strategy="beforeInteractive"
					src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`}
				/>
				<Analytics />
			</body>
		</html>
	);
}
