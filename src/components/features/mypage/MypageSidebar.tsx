import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserInfoQuery } from "@/hooks/useUserInfoQuery";
import { Check } from "lucide-react";
import { NavLink } from "react-router-dom";
import defaultProfile from "@/assets/images/profile.png";

export const MypageSidebar = () => {

    const { data: user } = useUserInfoQuery();

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

                <p className="text-sm text-gray-400">인증 완료된 계정입니다.</p>
            </div>

            {/* Navigation Menu */}
            <nav className="w-full px-8 flex-1">
                <div className="flex flex-col gap-6">
                    <div>
                        <NavLink
                            to="/mypage/profile"
                            className={({ isActive }) =>
                                `block text-lg font-bold mb-2 transition-colors ${isActive ? "text-primary" : "text-gray-900 hover:text-gray-700"
                                }`
                            }
                        >
                            프로필
                        </NavLink>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">모임</h3>
                        <div className="flex flex-col gap-3 pl-2">
                            <NavLink
                                to="/mypage/meetings/join"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                참여 모임
                            </NavLink>
                            <NavLink
                                to="/mypage/meetings/hosting"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                내 모임
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="w-full px-8 mt-auto">
                <button className="text-gray-400 hover:text-gray-600 text-sm" disabled>
                    탈퇴하기
                </button>
            </div>
        </aside>
    );
};
