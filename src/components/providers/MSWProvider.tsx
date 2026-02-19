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
	const [mswReady, setMswReady] = useState(true);
	const [isMounted, setIsMounted] = useState(false);

	const needsMocking = ENV.ENABLE_MOCK && ENV.IS_DEV;

	useEffect(() => {
		setIsMounted(true);

		const initMSW = async () => {
			if (!needsMocking) {
				setMswReady(true);
				return;
			}

			try {
				const { worker } = await import('@/mock/browser');
				await worker.start({
					onUnhandledRequest: 'bypass',
				});
				setMswReady(true);
			} catch (error) {
				console.error('[MSW] Failed to initialize MSW:', error);
				setMswReady(true);
			}
		};

		if (needsMocking) {
			setMswReady(false);
			initMSW();
		}
	}, [needsMocking]);

	// 1. 하이드레이션 에러 방지: 서버와 첫 렌더링 결과는 항상 동일하게 children을 반환
	if (!isMounted) {
		return <>{children}</>;
	}

	// 2. 클라이언트 마운트 이후 MSW 초기화 대기 중이면 스피너 표시
	if (needsMocking && !mswReady) {
		return <LoadingSpinner />;
	}

	return <>{children}</>;
}
