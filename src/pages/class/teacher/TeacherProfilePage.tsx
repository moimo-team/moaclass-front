import { useParams } from 'react-router-dom';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { LessonCard } from '@/components/features/lessons/LessonCard';
import { ReviewItem } from '@/components/features/lessons/ReviewItem';
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
	const reviews = (reviewsResponse?.data ?? []).filter((r) => !!r.representativeImage); // 이미지가 있는 후기만 표시

	return (
		<div className="w-full bg-gray-50/50 min-h-screen">
			{/* 배너 섹션 (프로필 이미지 흐리게 처리하여 배경으로 활용) */}
			<div className="relative h-64 md:h-80 w-full overflow-hidden bg-primary/10">
				{teacherProfile.image && (
					<div
						className="absolute inset-0 bg-cover bg-center blur-md opacity-30 scale-110"
						style={{ backgroundImage: `url(${teacherProfile.image})` }}
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50" />
			</div>

			<div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10 pb-20">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* 왼쪽: 프로필 사이드바 */}
					<div className="lg:col-span-1 space-y-6">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
							<div className="w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 mb-6">
								{teacherProfile.image ? (
									<img
										src={teacherProfile.image}
										alt={teacherProfile.nickname}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-400">
										No Image
									</div>
								)}
							</div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								{teacherProfile.nickname}
							</h1>
							<p className="text-primary font-medium mb-6">인증된 모멘토</p>
							<div className="w-full border-t border-gray-50 pt-6 text-left">
								<h3 className="font-bold text-gray-900 mb-4">소개</h3>
								<p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
									{teacherProfile.introduction}
								</p>
							</div>
						</div>
					</div>

					{/* 오른쪽: 콘텐츠 섹션 */}
					<div className="lg:col-span-2 space-y-12">
						{/* 클래스 목록 */}
						<section className="space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-bold text-gray-900">클래스 목록</h2>
								<span className="text-sm text-gray-500">총 {lessons.length}개</span>
							</div>

							{isLoadingLessons ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{[1, 2].map((i) => (
										<div
											key={i}
											className="h-64 bg-gray-100 rounded-xl animate-pulse"
										/>
									))}
								</div>
							) : lessons.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{lessons.map((lesson) => (
										<LessonCard key={lesson.id} lesson={lesson} />
									))}
								</div>
							) : (
								<div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed">
									등록된 클래스가 없습니다.
								</div>
							)}
						</section>

						{/* 후기 목록 */}
						<section className="space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-bold text-gray-900">대표 후기</h2>
								<span className="text-sm text-gray-500">
									이미지가 포함된 후기만 표시됩니다
								</span>
							</div>

							{isLoadingReviews ? (
								<div className="space-y-4">
									{[1, 2].map((i) => (
										<div
											key={i}
											className="h-32 bg-gray-100 rounded-xl animate-pulse"
										/>
									))}
								</div>
							) : reviews.length > 0 ? (
								<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
									{reviews.map((review) => (
										<ReviewItem
											key={review.id}
											review={{
												id: review.id,
												lessonId: review.id, // lessonId가 TeacherReview에 없는 경우 대비
												rating: review.rating,
												content: review.content,
												representativeImage: review.representativeImage,
												createdAt:
													review.createdAt || new Date().toISOString(),
												updatedAt:
													review.createdAt || new Date().toISOString(),
												user: {
													id: review.userId,
													nickname: '수강생', // API 보완 필요
													profileImage: null,
												},
											}}
										/>
									))}
								</div>
							) : (
								<div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed">
									작성된 후기가 없습니다.
								</div>
							)}
						</section>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeacherProfilePage;
