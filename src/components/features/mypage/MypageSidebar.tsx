import { useState } from 'react';

import { Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import defaultProfile from '@/assets/images/profile.png';
import ConfirmDialog from '@/components/features/modal/ConfirmDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDeleteUserMutation } from '@/hooks/useAuthMutations';
import { useAuthQuery } from '@/hooks/useAuthQuery';

interface MypageSidebarProps {
	onMenuItemClick?: () => void;
}

export const MypageSidebar = ({ onMenuItemClick }: MypageSidebarProps) => {
	const { data: user } = useAuthQuery();
	const { mutateAsync: deleteUser } = useDeleteUserMutation();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	if (!user) return null;

	// 회원 탈퇴 핸들러
	const handleDeleteUser = async () => {
		await deleteUser();
		setIsConfirmOpen(false);
	};

	return (
		<aside className="w-full h-full bg-white flex flex-col items-center py-10 border-r border-gray-100">
			{/* 프로필 섹션 */}
			<div className="flex flex-col items-center mb-10 w-full px-4">
				<div className="relative mb-4">
					<Avatar className="w-24 h-24 border-2 border-gray-100 bg-white">
						<AvatarImage
							src={user.profileImage || defaultProfile}
							alt={user.nickname || 'user'}
							className="object-cover"
						/>
						<AvatarFallback className="bg-yellow-50 text-yellow-600 font-bold">
							{user.nickname?.[0] || 'U'}
						</AvatarFallback>
					</Avatar>
				</div>

				<div className="flex items-center gap-2 mb-2">
					<h2 className="text-xl font-bold text-gray-900">{user.nickname || '사용자'}</h2>
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
								`block text-lg font-bold transition-colors ${
									isActive ? 'text-primary' : 'text-gray-900 hover:text-gray-700'
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
									`transition-colors ${
										isActive
											? 'text-primary font-bold'
											: 'text-gray-500 hover:text-gray-900'
									}`
								}
							>
								위시리스트
							</NavLink>
							<NavLink
								to="/mypage/class/points"
								onClick={onMenuItemClick}
								className={({ isActive }) =>
									`transition-colors ${
										isActive
											? 'text-primary font-bold'
											: 'text-gray-500 hover:text-gray-900'
									}`
								}
							>
								포인트
							</NavLink>
							<NavLink
								to="/mypage/class/coupons"
								onClick={onMenuItemClick}
								className={({ isActive }) =>
									`transition-colors ${
										isActive
											? 'text-primary font-bold'
											: 'text-gray-500 hover:text-gray-900'
									}`
								}
							>
								쿠폰
							</NavLink>
							<NavLink
								to="/mypage/class/orders"
								onClick={onMenuItemClick}
								className={({ isActive }) =>
									`transition-colors ${
										isActive
											? 'text-primary font-bold'
											: 'text-gray-500 hover:text-gray-900'
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
									`transition-colors ${
										isActive
											? 'text-primary font-bold'
											: 'text-gray-500 hover:text-gray-900'
									}`
								}
							>
								참여 모임
							</NavLink>
							<NavLink
								to="/mypage/meetings/hosting"
								onClick={onMenuItemClick}
								className={({ isActive }) =>
									`transition-colors ${
										isActive
											? 'text-primary font-bold'
											: 'text-gray-500 hover:text-gray-900'
									}`
								}
							>
								내 모임
							</NavLink>
						</div>
					</div>

					{/* 모멘토 */}
					{user.teacherProfile && (
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-4">모멘토</h3>
							<div className="flex flex-col gap-3 pl-2">
								<NavLink
									to="/lessons/manage"
									onClick={onMenuItemClick}
									className={({ isActive }) =>
										`transition-colors ${
											isActive
												? 'text-primary font-bold'
												: 'text-gray-500 hover:text-gray-900'
										}`
									}
								>
									클래스 관리
								</NavLink>
								<NavLink
									to="/mypage/class/profit"
									onClick={onMenuItemClick}
									className={({ isActive }) =>
										`transition-colors ${
											isActive
												? 'text-primary font-bold'
												: 'text-gray-500 hover:text-gray-900'
										}`
									}
								>
									수익 내역
								</NavLink>
							</div>
						</div>
					)}
				</div>
			</nav>

			{/* Footer */}
			<div className="w-full px-8 mt-auto pt-20 pb-4">
				<button
					onClick={() => {
						onMenuItemClick?.();
						setIsConfirmOpen(true);
					}}
					className="text-gray-400 hover:text-gray-600 text-sm"
				>
					탈퇴하기
				</button>
			</div>

			<ConfirmDialog
				open={isConfirmOpen}
				onOpenChange={setIsConfirmOpen}
				title="회원 탈퇴"
				description={`회원 탈퇴를 진행하면 내 클래스, 모임, 쿠폰, 포인트 내역 등이 모두 사라지며\n복구가 불가합니다.\n정말 탈퇴하시겠습니까?`}
				confirmText="탈퇴하기"
				cancelText="취소"
				onConfirm={handleDeleteUser}
				variant="destructive"
			/>
		</aside>
	);
};
