import { useAuthStore } from '@store/authStore';

import Banner from '@/components/features/home/banner';
import CategorySection from '@/components/features/home/CategorySection';
import HostedMeetingsList from '@/components/features/home/HostedMeetingsList';
import JoinedMeetingsList from '@/components/features/home/JoinedMeetingsList';
import PendingMeetingsList from '@/components/features/home/PendingMeetingsList';
import ReviewListSection from '@/components/features/home/ReviewListSection';
import HomeLessonSection from '@/components/features/lessons/HomeLessonSection';
import NewLessonList from '@/components/features/lessons/NewLessonList';
import { REGIONS } from '@/constants/regions';
import { useCategoryQuery } from '@/hooks/useCategoryQuery';

function Home() {
	const { isLoggedIn } = useAuthStore();
	const { data: categories } = useCategoryQuery();

	const experienceCategory = categories?.find((category) => category.name === '체험');
	const handmadeCategory = categories?.find((category) => category.name === '핸드메이드');
	const seoulRegion = REGIONS.find((region) => region.name === '서울');

	return (
		<>
			<Banner />
			<section
				className="flex w-full flex-col items-center pt-8"
				aria-label="메인 콘텐츠"
				data-testid="home-main-content"
			>
				<section
					className="w-full"
					aria-label="카테고리"
					data-testid="home-section-category"
				>
					<CategorySection />
				</section>
				<section
					className="w-full"
					aria-label="신규 클래스"
					data-testid="home-section-new-lessons"
				>
					<NewLessonList />
				</section>
				<section
					className="w-full"
					aria-label="좋아요 많은 클래스"
					data-testid="home-section-likes"
				>
					<HomeLessonSection
						title="좋아요 많은 클래스"
						seeMoreHref="/lessons?sort=LIKES"
						queryParams={{ sort: 'LIKES' }}
					/>
				</section>
				{experienceCategory && (
					<section
						className="w-full"
						aria-label="체험 추천 클래스"
						data-testid="home-section-experience"
					>
						<HomeLessonSection
							title="체험 추천 클래스"
							seeMoreHref={`/lessons?categoryId=${experienceCategory.id}&sort=LATEST`}
							queryParams={{ categoryId: experienceCategory.id, sort: 'LATEST' }}
						/>
					</section>
				)}
				{handmadeCategory && (
					<section
						className="w-full"
						aria-label="핸드메이드 추천 클래스"
						data-testid="home-section-handmade"
					>
						<HomeLessonSection
							title="핸드메이드 추천 클래스"
							seeMoreHref={`/lessons?categoryId=${handmadeCategory.id}&sort=LATEST`}
							queryParams={{ categoryId: handmadeCategory.id, sort: 'LATEST' }}
						/>
					</section>
				)}
				{seoulRegion && (
					<section
						className="w-full"
						aria-label="서울 지역 추천 클래스"
						data-testid="home-section-seoul"
					>
						<HomeLessonSection
							title="서울 지역 추천 클래스"
							seeMoreHref={`/lessons?regionId=${seoulRegion.id}&sort=LATEST`}
							queryParams={{ regionId: [seoulRegion.id], sort: 'LATEST' }}
						/>
					</section>
				)}
				<section className="w-full" aria-label="후기" data-testid="home-section-review">
					<ReviewListSection />
				</section>
				{isLoggedIn && (
					<>
						<section
							className="w-full"
							aria-label="참여 중인 모임"
							data-testid="home-section-joined-meetings"
						>
							<JoinedMeetingsList />
						</section>
						<section
							className="w-full"
							aria-label="주최 모임"
							data-testid="home-section-hosted-meetings"
						>
							<HostedMeetingsList />
						</section>
						<section
							className="w-full"
							aria-label="승인 대기 모임"
							data-testid="home-section-pending-meetings"
						>
							<PendingMeetingsList />
						</section>
					</>
				)}
			</section>
		</>
	);
}

export default Home;
