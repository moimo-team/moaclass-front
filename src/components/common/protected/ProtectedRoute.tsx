'use client';

import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import LoginRequiredDialog from '@/components/features/login/LoginRequiredDialog';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { isLoggedIn } = useAuthStore();
	const { isLoading } = useAuthQuery();
	const router = useRouter();

	// 인증 정보 확인 중이거나 로그아웃 중일 때
	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!isLoggedIn) {
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

export default ProtectedRoute;
