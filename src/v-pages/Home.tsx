import { useAuthStore } from '@store/authStore';

import Banner from '@/components/features/home/banner';
import CategorySection from '@/components/features/home/CategorySection';
import HostedMeetingsList from '@/components/features/home/HostedMeetingsList';
import JoinedMeetingsList from '@/components/features/home/JoinedMeetingsList';
import PendingMeetingsList from '@/components/features/home/PendingMeetingsList';
import ReviewListSection from '@/components/features/home/ReviewListSection';
import NewLessonList from '@/components/features/lessons/NewLessonList';

function Home() {
	const { isLoggedIn } = useAuthStore();

	return (
		<>
			<Banner />
			<section className="flex flex-col pt-8 items-center w-full" aria-label="홈 콘텐츠">
				<section aria-label="카테고리">
					<CategorySection />
				</section>
				{/* TODO: LikeMeetingList(좋아요순), 특정 카테고리 몇 개 추가 */}
				<section aria-label="신규 클래스">
					<NewLessonList />
				</section>
				{/* TODO: 후기 리스트 추가 후 mock 데이터 삭제 */}
				<section aria-label="후기">
					<ReviewListSection />
				</section>
				{isLoggedIn && (
					<>
						{/* TODO: 리스트 삭제 or 그대로 사용할지 회의 */}
						<section aria-label="참여 중인 모임">
							<JoinedMeetingsList />
						</section>
						<section aria-label="주최 모임">
							<HostedMeetingsList />
						</section>
						<section aria-label="승인 대기 모임">
							<PendingMeetingsList />
						</section>
					</>
				)}
			</section>
		</>
	);
}

export default Home;
