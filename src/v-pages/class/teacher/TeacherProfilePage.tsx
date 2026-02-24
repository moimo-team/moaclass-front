import { useState } from 'react';

import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmDialog from '@/components/features/modal/ConfirmDialog';
import { TeacherProfileModal } from '@/components/features/modal/profile/TeacherProfileModal';
import { TeacherLessonList } from '@/components/features/teacher/profile/TeacherLessonList';
import { TeacherProfileBanner } from '@/components/features/teacher/profile/TeacherProfileBanner';
import { TeacherProfileSidebar } from '@/components/features/teacher/profile/TeacherProfileSidebar';
import { TeacherReviewList } from '@/components/features/teacher/profile/TeacherReviewList';
import { Button } from '@/components/ui/button';
import { useTeacherLessonsQuery } from '@/hooks/useTeacherLessonsQuery';
import {
	useDeleteTeacherProfileMutation,
	useTeacherProfileQuery,
} from '@/hooks/useTeacherProfileMutations';
import { useTeacherReviewsQuery } from '@/hooks/useTeacherReviewsQuery';
import { useAuthStore } from '@/store/authStore';

interface TeacherProfilePageProps {
	userId?: number;
}

const TeacherProfilePage = ({ userId: userIdProp }: TeacherProfilePageProps) => {
	const { userId: userIdParam } = useParams<{ userId: string }>();
	const currentUserId = useAuthStore((state) => state.userId);
	const teacherId = userIdProp || Number(userIdParam) || (currentUserId ?? 0);

	const isMe = teacherId === currentUserId;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const deleteMutation = useDeleteTeacherProfileMutation();

	const { data: teacherProfile, isLoading: isLoadingProfile } = useTeacherProfileQuery(
		teacherId || undefined,
	);
	const { data: lessonsResponse, isLoading: isLoadingLessons } = useTeacherLessonsQuery(
		teacherId as number,
	);
	const { data: reviewsResponse, isLoading: isLoadingReviews } = useTeacherReviewsQuery(
		teacherId as number,
	);

	if (isLoadingProfile) {
		return <LoadingSpinner />;
	}

	// 내 프로필도 아니고, 조회된 프로필도 없으면 '찾을 수 없음' 표시
	if (!teacherProfile && !isMe) {
		return (
			<div className="w-full flex items-center justify-center py-20">
				<div className="text-center space-y-6 max-w-md">
					<div className="space-y-2">
						<h2 className="text-2xl font-bold text-gray-900">
							모멘토를 찾을 수 없습니다
						</h2>
						<p className="text-gray-600">존재하지 않는 모멘토입니다.</p>
					</div>
				</div>
			</div>
		);
	}

	// 운영중(ACTIVE) 상태인 클래스만 표시
	const lessons = (lessonsResponse?.data ?? []).filter((l) => l.status === 'ACTIVE');
	// 이미지가 있는 후기만 '대표 후기'로 표시
	const representativeReviews = (reviewsResponse?.data ?? []).filter(
		(r) => !!r.representativeImage,
	);

	const handleDeleteConfirm = async () => {
		if (lessons.length > 0) {
			toast.error('진행중인 클래스가 있어서 삭제가 불가합니다.');
			setIsDeleteDialogOpen(false);
			return;
		}
		await deleteMutation.mutateAsync();
	};

	return (
		<div className="w-full bg-gray-50/50 min-h-screen">
			<TeacherProfileBanner image={teacherProfile?.image} />

			<div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10 pb-20">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* 프로필 사이드바 / 등록 유도 영역 */}
					<div className="lg:col-span-1 space-y-6">
						{teacherProfile ? (
							<TeacherProfileSidebar
								profile={teacherProfile}
								isMe={isMe}
								onEdit={() => setIsModalOpen(true)}
								onDelete={() => setIsDeleteDialogOpen(true)}
							/>
						) : (
							<div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center space-y-4">
								<div className="w-20 h-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center">
									<Plus className="w-8 h-8 text-gray-300" />
								</div>
								<div className="space-y-1 text-sm">
									<p className="font-bold text-gray-900">모멘토 프로필 미등록</p>
									<p className="text-gray-500">
										프로필을 등록하고 클래스를 시작해보세요!
									</p>
								</div>
								<Button
									onClick={() => setIsModalOpen(true)}
									className="w-full rounded-xl"
								>
									프로필 등록하기
								</Button>
							</div>
						)}
					</div>

					{/* 메인 콘텐츠 영역 (목록은 항상 보임) */}
					<div className="lg:col-span-2 space-y-12">
						<TeacherLessonList lessons={lessons} isLoading={isLoadingLessons} />
						<TeacherReviewList
							reviews={representativeReviews}
							isLoading={isLoadingReviews}
						/>
					</div>
				</div>
			</div>

			<TeacherProfileModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				profile={teacherProfile || null}
			/>

			<ConfirmDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				title="모멘토 프로필 삭제"
				description={`정말로 모멘토 프로필을 삭제하시겠습니까?\n프로필 삭제 시 등록된 모든 클래스와 정보가 삭제되며 되돌릴 수 없습니다.`}
				confirmText="삭제하기"
				variant="destructive"
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
};

export default TeacherProfilePage;
