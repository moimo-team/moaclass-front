import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { NotificationDropdown } from "@/components/common/NotificationDropdown";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { Input } from "@components/ui/input";
import { useState } from "react";

function Header() {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [searchTopic, setSearchTopic] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchTopic.trim()) return;
    // navigate(`/meetings/search?keyword=${searchTopic}`); TODO: API 확인 후 경로 수정
    navigate(`/`);
  };
  return (
    <div className="w-full h-[80px] bg-card sticky top-0 z-50 shrink-0 border-b border-gray-300">
      <div className="flex items-center w-full h-full max-w-screen-xl mx-auto px-4 md:px-8">
        <Button
          asChild
          size="lg"
          variant="ghost"
          className="cursor-pointer hover:bg-medium font-bold text-2xl p-0"
        >
          <Link to="/">모아클</Link>
        </Button>

        <form onSubmit={handleSearch} className="relative ml-8 w-full max-w-xs">
          <Input
            type="text"
            placeholder="관심있는 클래스 제목을 검색해 보세요"
            className="pl-4 h-11 flex-1 bg-card"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <IoIosSearch size={24} />
          </Button>
        </form>

        {isLoggedIn ? (
          <div className="ml-auto flex items-center gap-3 md:gap-4">
            <Button
              asChild
              size="default"
              variant="ghost"
              className="cursor-pointer hover:bg-medium text-base border border-gray-300"
            >
              <Link to="/classes-manage">클래스 관리</Link>
            </Button>
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
