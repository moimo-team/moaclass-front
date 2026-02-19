import { useState } from 'react';

import { Pencil, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { TeacherProfileModal } from '@/components/features/modal/profile/TeacherProfileModal';
import { TeacherLessonList } from '@/components/features/teacher/profile/TeacherLessonList';
import { TeacherProfileBanner } from '@/components/features/teacher/profile/TeacherProfileBanner';
import { TeacherProfileSidebar } from '@/components/features/teacher/profile/TeacherProfileSidebar';
import { TeacherReviewList } from '@/components/features/teacher/profile/TeacherReviewList';
import { Button } from '@/components/ui/button';
import { useTeacherLessonsQuery } from '@/hooks/useTeacherLessonsQuery';
import { useTeacherProfileQuery } from '@/hooks/useTeacherProfileMutations';
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

	return (
		<div className="w-full bg-gray-50/50 min-h-screen">
			<TeacherProfileBanner image={teacherProfile?.image} />

			<div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10 pb-20">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* 프로필 사이드바 / 등록 유도 영역 */}
					<div className="lg:col-span-1 space-y-6">
						{teacherProfile ? (
							<div className="relative group">
								<TeacherProfileSidebar profile={teacherProfile} />
								{isMe && (
									<Button
										onClick={() => setIsModalOpen(true)}
										className="absolute top-4 right-4 rounded-full w-10 h-10 p-0 shadow-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<Pencil className="w-4 h-4" />
									</Button>
								)}
							</div>
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
		</div>
	);
};

export default TeacherProfilePage;
