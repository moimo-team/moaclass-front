import NewMeetingList from "@/components/features/home/NewMeetingList";
import JoinedMeetingsList from "@/components/features/home/JoinedMeetingsList";
import PendingMeetingsList from "@/components/features/home/PendingMeetingsList";
import HostedMeetingsList from "@/components/features/home/HostedMeetingsList";
// import SearchSection from "@features/search/SearchSection";
import TopicSection from "@features/topics/TopicSection";
import { useAuthStore } from "@store/authStore";
import Banner from "@/components/features/home/banner";

function Home() {
  const { isLoggedIn } = useAuthStore();
  return (
    <div className="flex flex-col justify-center items-center">
      {/* TODO: SearchSection 삭제 */}
      {/* <SearchSection /> */}
      <Banner />
      <div className="flex flex-col pt-8 items-center w-full">
        {/* TODO: TopicSection 삭제 후 카테고리 섹션 추가 */}
        <TopicSection />
        {/* TODO: LikeMeetingList(좋아요순), 특정 카테고리 몇 개 추가 */}
        <NewMeetingList />
        {/* TODO: 후기 리스트 추가 */}
        {isLoggedIn && (
          <>
            <JoinedMeetingsList />
            <HostedMeetingsList />
            <PendingMeetingsList />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
