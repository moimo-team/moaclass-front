'use client';

import type { ReactNode } from 'react';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';

import NextRouterAdapter from '@/app/_components/NextRouterAdapter';
import { Toaster } from '@/components/ui/sonner';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { queryClient } from '@/lib/queryClient';

import MSWProvider from './MSWProvider';

interface ProvidersProps {
	children: ReactNode;
}

/**
 * 초기 인증 상태 확인을 위한 내부 컴포넌트
 * - QueryClientProvider 내부에서 호출되어야 하므로 분리되었습니다.
 */
function AuthInitializer({ children }: { children: ReactNode }) {
	useAuthQuery();
	return <>{children}</>;
}

/**
 * Next.js용 전역 Provider 통합 컴포넌트
 * - QueryClient, GoogleOAuth, Toaster 등을 관리합니다.
 * - 클라이언트 컴포넌트로 선언되어 브라우저 전용 로직을 안전하게 처리합니다.
 */
export default function Providers({ children }: ProvidersProps) {
	// 환경 변수에서 구글 클라이언트 ID 로드
	const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

	return (
		<MSWProvider>
			<QueryClientProvider client={queryClient}>
				<NextRouterAdapter>
					<AuthInitializer>
						<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
							{children}
							<Toaster
								position="top-center"
								expand={true}
								richColors
								duration={3000}
								toastOptions={{
									style: {
										fontSize: '14px',
										padding: '16px',
									},
									className: 'font-medium',
								}}
							/>
						</GoogleOAuthProvider>
					</AuthInitializer>
				</NextRouterAdapter>
			</QueryClientProvider>
		</MSWProvider>
	);
}
