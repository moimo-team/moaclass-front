import NewMeetingList from "@/components/features/home/NewMeetingList";
import JoinedMeetingsList from "@/components/features/home/JoinedMeetingsList";
import PendingMeetingsList from "@/components/features/home/PendingMeetingsList";
import HostedMeetingsList from "@/components/features/home/HostedMeetingsList";
import SearchSection from "@features/search/SearchSection";
import TopicSection from "@features/topics/TopicSection";
import { useAuthStore } from "@store/authStore";

function Home() {
  const { isLoggedIn } = useAuthStore();
  return (
    <div className="flex flex-col justify-center items-center">
      <SearchSection />
      <div className="flex flex-col pt-8 items-center w-full">
        <TopicSection />
        <NewMeetingList />
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
