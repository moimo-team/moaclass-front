import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { Check } from "lucide-react";
import { NavLink } from "react-router-dom";
import defaultProfile from "@/assets/images/profile.png";
import { toast } from "sonner";


interface MypageSidebarProps {
    onMenuItemClick?: () => void;
}

export const MypageSidebar = ({ onMenuItemClick }: MypageSidebarProps) => {

    const { data: user } = useAuthQuery();

    if (!user) return null;

    return (
        <aside className="w-full h-full bg-white flex flex-col items-center py-10 border-r border-gray-100">
            {/* 프로필 섹션 */}
            <div className="flex flex-col items-center mb-10 w-full px-4">
                <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-2 border-gray-100 bg-white">
                        <AvatarImage
                            src={user.profileImage || defaultProfile}
                            alt={user.nickname || "user"}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-yellow-50 text-yellow-600 font-bold">
                            {user.nickname?.[0] || "U"}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{user.nickname || "사용자"}</h2>
                    <div className="bg-green-500 rounded p-[2px]">
                        <Check className="w-3 h-3 text-white" strokeWidth={4} />
                    </div>
                </div>

                <p className="text-sm text-gray-400">{user.email}</p>
            </div>

            {/* Navigation Menu */}
            <nav className="w-full px-8 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-8">
                    {/* 프로필 */}
                    <div>
                        <NavLink
                            to="/mypage/profile"
                            onClick={onMenuItemClick}
                            className={({ isActive }) =>
                                `block text-lg font-bold transition-colors ${isActive ? "text-primary" : "text-gray-900 hover:text-gray-700"
                                }`
                            }
                        >
                            프로필
                        </NavLink>
                    </div>

                    {/* 원데이클래스 */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">원데이클래스</h3>
                        <div className="flex flex-col gap-3 pl-2">
                            <NavLink
                                to="/mypage/class/wish-list"
                                onClick={onMenuItemClick}
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                위시리스트
                            </NavLink>
                            <NavLink
                                to="/mypage/class/points"
                                onClick={onMenuItemClick}
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                포인트
                            </NavLink>
                            <NavLink
                                to="/mypage/class/coupons"
                                onClick={onMenuItemClick}
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                쿠폰
                            </NavLink>
                            <NavLink
                                to="/mypage/class/orders"
                                onClick={onMenuItemClick}
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                클래스 결제 내역
                            </NavLink>
                        </div>
                    </div>

                    {/* 모임 */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">모임</h3>
                        <div className="flex flex-col gap-3 pl-2">
                            <NavLink
                                to="/mypage/meetings/join"
                                onClick={onMenuItemClick}
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                참여 모임
                            </NavLink>
                            <NavLink
                                to="/mypage/meetings/hosting"
                                onClick={onMenuItemClick}
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                내 모임
                            </NavLink>
                        </div>
                    </div>

                    {/* 모멘토 */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">모멘토</h3>
                        <div className="flex flex-col gap-3 pl-2">
                            <NavLink
                                to="/classes-manage"
                                onClick={onMenuItemClick}
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                클래스 관리
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="w-full px-8 mt-auto pt-20 pb-4">
                <button
                    onClick={() => {
                        toast.error("준비 중인 서비스입니다.");
                        onMenuItemClick?.();
                    }}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                >
                    탈퇴하기
                </button>
            </div>
        </aside>
    );
};

