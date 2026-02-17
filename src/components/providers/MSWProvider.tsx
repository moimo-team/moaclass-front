'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { ENV } from '@/utils/env';

import LoadingSpinner from '../common/LoadingSpinner';

interface MSWProviderProps {
	children: ReactNode;
}

/**
 * Next.js용 MSW 초기화 Provider
 * - 클라이언트 사이드에서만 MSW를 초기화합니다.
 * - 개발 환경에서만 동작하며, ENABLE_MOCK이 true일 때만 활성화됩니다.
 */
export default function MSWProvider({ children }: MSWProviderProps) {
	const [mswReady, setMswReady] = useState(!ENV.IS_DEV || !ENV.ENABLE_MOCK);

	useEffect(() => {
		// 디버깅: 환경 변수 확인
		console.log('[MSW Debug] ENV.IS_DEV:', ENV.IS_DEV);
		console.log('[MSW Debug] ENV.ENABLE_MOCK:', ENV.ENABLE_MOCK);
		console.log('[MSW Debug] process.env.NODE_ENV:', process.env.NODE_ENV);
		console.log(
			'[MSW Debug] process.env.NEXT_PUBLIC_ENABLE_MOCK:',
			process.env.NEXT_PUBLIC_ENABLE_MOCK,
		);

		const initMSW = async () => {
			if (!ENV.IS_DEV || !ENV.ENABLE_MOCK) {
				console.log(
					'[MSW] Skipping MSW initialization. IS_DEV:',
					ENV.IS_DEV,
					'ENABLE_MOCK:',
					ENV.ENABLE_MOCK,
				);
				setMswReady(true);
				return;
			}

			try {
				console.log('[MSW] Starting MSW initialization...');
				const { worker } = await import('@/mock/browser');

				console.log('[MSW] Worker imported, starting...');
				await worker.start({
					onUnhandledRequest: 'bypass',
				});

				console.log('[MSW] Mock Service Worker initialized for Next.js');
				setMswReady(true);
			} catch (error) {
				console.error('[MSW] Failed to initialize MSW:', error);
				// 에러가 발생해도 앱은 계속 실행
				setMswReady(true);
			}
		};

		initMSW();
	}, []);

	// MSW 초기화 전에는 렌더링하지 않음
	if (!mswReady) {
		return <LoadingSpinner />;
	}

	return <>{children}</>;
}
