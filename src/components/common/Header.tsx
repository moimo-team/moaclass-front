import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { NotificationDropdown } from "@/components/common/NotificationDropdown";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { Link } from "react-router-dom";
import { IoIosChatbubbles } from "react-icons/io";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function Header() {
  const { isLoggedIn } = useAuthStore();
  return (
    <div className="w-full h-[80px] bg-card sticky top-0 z-50 shrink-0 border-b border-gray-300">
      <div className="flex items-center w-full h-full max-w-screen-xl mx-auto px-4 md:px-8">
        <Button
          asChild
          size="lg"
          variant="ghost"
          className="cursor-pointer hover:bg-medium font-bold text-2xl p-0"
        >
          <Link to="/">MoiMo</Link>
        </Button>
        <div className="flex gap-2 ml-8">
          <Button
            asChild
            size="default"
            variant="ghost"
            className="cursor-pointer hover:bg-medium text-base"
          >
            <Link to="/moimer-intro">모이머란?</Link>
          </Button>
          <Button
            asChild
            size="default"
            variant="ghost"
            className="cursor-pointer hover:bg-medium text-base"
          >
            <Link to="/meetings">원하는 모임 찾기</Link>
          </Button>
        </div>
        {isLoggedIn ? (
          <div className="ml-auto flex items-center gap-3 md:gap-4">
            <Link to="/chats">
              <button className="focus:outline-none focus:ring-offset-2 rounded-full">
                <Avatar className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border-none bg-medium">
                  <AvatarFallback className="bg-medium">
                    <IoIosChatbubbles className="w-7 h-7 text-foreground/80" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </Link>
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        ) : (
          <div className="login ml-auto">
            <Button
              asChild
              size="default"
              variant="ghost"
              className="cursor-pointer hover:bg-medium text-base"
            >
              <Link to="/login">로그인</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
