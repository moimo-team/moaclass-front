import { useParams } from 'react-router-dom';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { TeacherLessonList } from '@/components/features/teacher/profile/TeacherLessonList';
import { TeacherProfileBanner } from '@/components/features/teacher/profile/TeacherProfileBanner';
import { TeacherProfileSidebar } from '@/components/features/teacher/profile/TeacherProfileSidebar';
import { TeacherReviewList } from '@/components/features/teacher/profile/TeacherReviewList';
import { useTeacherLessonsQuery } from '@/hooks/useTeacherLessonsQuery';
import { useTeacherProfileQuery } from '@/hooks/useTeacherProfileMutations';
import { useTeacherReviewsQuery } from '@/hooks/useTeacherReviewsQuery';

const TeacherProfilePage = () => {
	const { userId } = useParams<{ userId: string }>();
	const teacherId = Number(userId);

	const { data: teacherProfile, isLoading: isLoadingProfile } = useTeacherProfileQuery(teacherId);
	const { data: lessonsResponse, isLoading: isLoadingLessons } =
		useTeacherLessonsQuery(teacherId);
	const { data: reviewsResponse, isLoading: isLoadingReviews } =
		useTeacherReviewsQuery(teacherId);

	if (isLoadingProfile) {
		return <LoadingSpinner />;
	}

	if (!teacherProfile) {
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

	const lessons = lessonsResponse?.data ?? [];
	// 이미지가 있는 후기만 '대표 후기'로 표시
	const representativeReviews = (reviewsResponse?.data ?? []).filter(
		(r) => !!r.representativeImage,
	);

	return (
		<div className="w-full bg-gray-50/50 min-h-screen">
			<TeacherProfileBanner image={teacherProfile.image} />

			<div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10 pb-20">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* 프로필 사이드바 */}
					<div className="lg:col-span-1">
						<TeacherProfileSidebar profile={teacherProfile} />
					</div>

					{/* 메인 콘텐츠 영역 */}
					<div className="lg:col-span-2 space-y-12">
						<TeacherLessonList lessons={lessons} isLoading={isLoadingLessons} />
						<TeacherReviewList
							reviews={representativeReviews}
							isLoading={isLoadingReviews}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeacherProfilePage;
