import { useState } from 'react';

import { useAuthStore } from '@store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

import Banner from '@/components/features/home/banner';
import ClassBox from '@/components/features/home/ClassBox';
import HostedMeetingsList from '@/components/features/home/HostedMeetingsList';
import JoinedMeetingsList from '@/components/features/home/JoinedMeetingsList';
import MainModeToggle, { type MainMode } from '@/components/features/home/MainModeToggle';
import MeetingListSection from '@/components/features/home/MeetingListSection';
import PendingMeetingsList from '@/components/features/home/PendingMeetingsList';
import ReviewListSection from '@/components/features/home/ReviewListSection';
import HomeLessonSection from '@/components/features/lessons/HomeLessonSection';
import NewLessonList from '@/components/features/lessons/NewLessonList';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useCategoryQuery } from '@/hooks/useCategoryQuery';

function Home() {
	const { isLoggedIn } = useAuthStore();
	const { data: categories } = useCategoryQuery();
	const { data: authUser } = useAuthQuery();
	const [activeMode, setActiveMode] = useState<MainMode>('lesson');

	const experienceCategory = categories?.find((category) => category.name === '체험');
	const handmadeCategory = categories?.find((category) => category.name === '핸드메이드');
	const userRegionId = authUser?.region?.id;
	const userRegionName = authUser?.region?.name;

	return (
		<>
			<Banner onMeetingBannerClick={() => setActiveMode('meeting')} />

			<MainModeToggle mode={activeMode} setMode={setActiveMode} />

			<section
				className="flex w-full flex-col items-center pb-20"
				aria-label="메인 콘텐츠"
				data-testid="home-main-content"
			>
				<AnimatePresence mode="wait">
					{activeMode === 'lesson' ? (
						<motion.div
							key="lesson"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
							className="w-full space-y-8 mt-4"
						>
							<ClassBox className="w-full">
								<section
									className="w-full"
									aria-label="신규 클래스"
									data-testid="home-section-new-lessons"
								>
									<NewLessonList />
								</section>
							</ClassBox>

							<ClassBox className="w-full">
								<section
									className="w-full"
									aria-label="좋아요를 많이 받은 클래스"
									data-testid="home-section-likes"
								>
									<HomeLessonSection
										title="좋아요를 많이 받은 클래스"
										seeMoreHref="/lessons?sort=LIKES"
										queryParams={{ sort: 'LIKES' }}
									/>
								</section>
							</ClassBox>

							{experienceCategory && (
								<ClassBox className="w-full">
									<section
										className="w-full"
										aria-label="체험 추천 클래스"
										data-testid="home-section-experience"
									>
										<HomeLessonSection
											title="체험 추천 클래스"
											seeMoreHref={`/lessons?categoryId=${experienceCategory.id}&sort=LATEST`}
											queryParams={{
												categoryId: experienceCategory.id,
												sort: 'LATEST',
											}}
										/>
									</section>
								</ClassBox>
							)}

							{handmadeCategory && (
								<ClassBox className="w-full">
									<section
										className="w-full"
										aria-label="핸드메이드 추천 클래스"
										data-testid="home-section-handmade"
									>
										<HomeLessonSection
											title="핸드메이드 추천 클래스"
											seeMoreHref={`/lessons?categoryId=${handmadeCategory.id}&sort=LATEST`}
											queryParams={{
												categoryId: handmadeCategory.id,
												sort: 'LATEST',
											}}
										/>
									</section>
								</ClassBox>
							)}

							{isLoggedIn && userRegionId && userRegionName && (
								<ClassBox className="w-full">
									<section
										className="w-full"
										aria-label="지역 추천 클래스"
										data-testid="home-section-region"
									>
										<HomeLessonSection
											title={`${userRegionName} 지역 추천 클래스`}
											seeMoreHref={`/lessons?regionId=${userRegionId}&sort=LATEST`}
											queryParams={{
												regionId: [userRegionId],
												sort: 'LATEST',
											}}
										/>
									</section>
								</ClassBox>
							)}

							<ClassBox className="w-full">
								<section
									className="w-full"
									aria-label="후기"
									data-testid="home-section-review"
								>
									<ReviewListSection />
								</section>
							</ClassBox>
						</motion.div>
					) : (
						<motion.div
							key="meeting"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
							className="w-full"
						>
							<ClassBox className="w-full">
								<section
									className="w-full"
									aria-label="전체 모임"
									data-testid="home-section-all-meetings"
								>
									<MeetingListSection
										title="전체 모임"
										seeMoreHref="/meetings"
										queryOptions={{ page: 1, limit: 12, sort: 'NEW' }}
									/>
								</section>
							</ClassBox>

							{isLoggedIn && (
								<>
<<<<<<< fix/notification
									<section
										className="w-full"
										aria-label="마감 임박 모임"
										data-testid="home-section-deadline-meetings"
									>
										<MeetingListSection
											title="마감 임박 모임"
											seeMoreHref="/meetings?sort=DEADLINE"
											queryOptions={{ page: 1, limit: 8, sort: 'DEADLINE' }}
											hideIfEmpty
										/>
									</section>
=======
									<ClassBox className="w-full">
										<section
											className="w-full"
											aria-label="내 지역 인기 모임"
											data-testid="home-section-popular-meetings"
										>
											<MeetingListSection
												title={`${userRegionName || '내 지역'} 인기 모임`}
												seeMoreHref="/meetings"
												queryOptions={{ page: 1, limit: 8, sort: 'UPDATE' }}
												hideIfEmpty
											/>
										</section>
									</ClassBox>
>>>>>>> main

									<ClassBox className="w-full mt-8">
										<section
											className="w-full"
											aria-label="따끈따끈한 신규 모임"
											data-testid="home-section-new-meetings"
										>
											<MeetingListSection
												title="따끈따끈한 신규 모임"
												seeMoreHref="/meetings"
												queryOptions={{ page: 1, limit: 8, sort: 'NEW' }}
												hideIfEmpty
											/>
										</section>
									</ClassBox>

									<ClassBox className="w-full mt-8">
										<section
											className="w-full"
											aria-label="참여 중인 모임"
											data-testid="home-section-joined-meetings"
										>
											<JoinedMeetingsList />
										</section>
									</ClassBox>

									<ClassBox className="w-full mt-8">
										<section
											className="w-full"
											aria-label="주최 모임"
											data-testid="home-section-hosted-meetings"
										>
											<HostedMeetingsList />
										</section>
									</ClassBox>

									<ClassBox className="w-full mt-8">
										<section
											className="w-full"
											aria-label="승인 대기 모임"
											data-testid="home-section-pending-meetings"
										>
											<PendingMeetingsList />
										</section>
									</ClassBox>
								</>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</section>
		</>
	);
}

export default Home;
