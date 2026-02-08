import { MypageSidebar } from "@/components/features/mypage/MypageSidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const MypageSession = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-full flex-col md:flex-row flex-1 bg-background">
      {/* Mobile Header - 화면 너비 768px 미만일 때 표시 */}
      <div className="md:hidden p-4 border-b flex items-center bg-white sticky top-0 z-10">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px]">
            {/* 모바일 사이드바에서 메뉴 클릭 시 시트 닫기 */}
            <MypageSidebar onMenuItemClick={() => setIsSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="ml-2 font-bold text-lg">마이페이지</h1>
      </div>

      {/* Desktop leftSidebar - 마이페이지바 (MD 이상에서만 보임) */}
      <div className="hidden md:flex flex-[1] shrink-0 flex-col overflow-hidden">
        <MypageSidebar />
      </div>

      {/* 메인 영역 - 스크롤 가능하도록 설정 */}
      <div className="flex flex-col overflow-hidden flex-[4] p-4 md:p-0 md:pl-12">
        <Outlet />
      </div>
    </div>
  )
}

export default MypageSession;