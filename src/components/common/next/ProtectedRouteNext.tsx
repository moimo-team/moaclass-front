'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import LoginRequiredDialog from '@/components/features/login/LoginRequiredDialog';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteNextProps {
	children: React.ReactNode;
}

const ProtectedRouteNext = ({ children }: ProtectedRouteNextProps) => {
	const { isLoggedIn, isLoggingOut } = useAuthStore();
	const { isLoading, isFetching } = useAuthQuery();
	const router = useRouter();
	const [shouldShowAlert, setShouldShowAlert] = useState(false);

	// 렌더링 중에 상태 초기화 (리액트 권장 패턴: props/state 변화에 따른 상태 동기화)
	if ((isLoggedIn || isLoggingOut || isLoading || isFetching) && shouldShowAlert) {
		setShouldShowAlert(false);
	}

	useEffect(() => {
		// 로그아웃 중이거나 인증 확인 중이 아니라면 (확실히 비로그인 상태일 때)
		if (!isLoggedIn && !isLoggingOut && !isLoading && !isFetching) {
			// 500ms 지연 후 알림창 표시 (리다이렉트 시간을 벌어줌)
			const timer = setTimeout(() => {
				setShouldShowAlert(true);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [isLoggedIn, isLoggingOut, isLoading, isFetching]);

	// 1. 인증 정보 확인 중이거나 로그아웃 중일 때
	if (isLoading || isFetching || isLoggingOut) {
		return <LoadingSpinner />;
	}

	if (!isLoggedIn) {
		// 지연 시간 동안에는 스피너를 보여주어 플래시 현상 방지
		if (!shouldShowAlert) {
			return <LoadingSpinner />;
		}

		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<LoginRequiredDialog
					open={true}
					title="로그인이 필요한 서비스입니다"
					description={`이 콘텐츠를 이용하시려면 먼저 로그인해 주세요.\n로그인 페이지로 이동하시겠습니까?`}
					showCancel={true}
					onCancel={() => router.push('/')}
				/>
			</div>
		);
	}

	return <>{children}</>;
};

export default ProtectedRouteNext;
