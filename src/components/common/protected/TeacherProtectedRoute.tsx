'use client';

import { useRouter } from 'next/navigation';

import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useAuthStore } from '@/store/authStore';

import LoginRequiredDialog from '../../features/login/LoginRequiredDialog';
import ConfirmDialog from '../../features/modal/ConfirmDialog';
import LoadingSpinner from '../LoadingSpinner';

interface TeacherProtectedRouteProps {
	children: React.ReactNode;
}

const TeacherProtectedRoute = ({ children }: TeacherProtectedRouteProps) => {
	const { isLoggedIn, isTeacher } = useAuthStore();
	const { isLoading } = useAuthQuery();
	const router = useRouter();

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!isLoggedIn) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<LoginRequiredDialog open={true} onCancel={() => router.push('/')} />
			</div>
		);
	}

	if (!isTeacher) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<ConfirmDialog
					open={true}
					onOpenChange={() => {}}
					title="권한이 없습니다"
					description={`모멘토로 등록된 사용자만 접근할 수 있는 페이지입니다.\n모멘토 신청 페이지로 이동하시겠습니까?`}
					confirmText="이동하기"
					cancelText="취소"
					showCancel={true}
					onConfirm={() => router.push('/classes-manage')}
					onCancel={() => router.push('/mypage/profile')}
				/>
			</div>
		);
	}

	return <>{children}</>;
};

export default TeacherProtectedRoute;
