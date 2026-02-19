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
			<div className="flex flex-col pt-8 items-center w-full">
				<CategorySection />
				{/* TODO: LikeMeetingList(좋아요순), 특정 카테고리 몇 개 추가 */}
				<NewLessonList />
				{/* TODO: 후기 리스트 추가 후 mock 데이터 삭제 */}
				<ReviewListSection />
				{isLoggedIn && (
					<>
						{/* TODO: 리스트 삭제 or 그대로 사용할지 회의 */}
						<JoinedMeetingsList />
						<HostedMeetingsList />
						<PendingMeetingsList />
					</>
				)}
			</div>
		</>
	);
}

export default Home;
