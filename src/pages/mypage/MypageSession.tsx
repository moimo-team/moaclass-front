import { MypageSidebar } from "@/components/features/mypage/MypageSidebar";
import { Outlet } from "react-router-dom";

const MypageSession = () => {
  return (
    <div className="flex w-full flex-1 bg-background">
      {/* leftSidebar - 마이페이지바 */}
      <div className="flex-[1] shrink-0 flex flex-col overflow-hidden">
        <MypageSidebar />
      </div>
      {/* 메인 영역 - 스크롤 가능하도록 설정 */}
      <div className="flex flex-col overflow-hidden flex-[4] pl-12">
        <Outlet />
      </div>
    </div>
  )
}

export default MypageSession;