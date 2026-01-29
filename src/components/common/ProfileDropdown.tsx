import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultProfileImage from "@/assets/images/profile.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiOutlineUser, AiOutlineTeam } from "react-icons/ai";
import { IoIosPerson } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/hooks/useAuthMutations";
import { useAuthQuery } from "@/hooks/useAuthQuery";

export const ProfileDropdown = () => {
  const { nickname } = useAuthStore();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  const { data: userData } = useAuthQuery();
  const userProfileImage = userData?.profileImage || defaultProfileImage;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
          <Avatar className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border-none bg-transparent">
            <AvatarImage src={userProfileImage} alt="User Avatar" />
            <AvatarFallback className="bg-transparent">
              <IoIosPerson className="w-7 h-7 text-foreground/80" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{nickname} 님</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => navigate("/mypage")}
        >
          <AiOutlineUser />
          마이페이지
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex gap-1"
          onClick={() => navigate("/mypage/meetings/join")}
        >
          <AiOutlineTeam />내 모임
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-1" onClick={handleLogout}>
          <LuLogOut />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
