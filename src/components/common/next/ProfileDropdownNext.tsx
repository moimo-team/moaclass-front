'use client';

import { useRouter } from 'next/navigation';
import { AiOutlineUser, AiOutlineMessage } from 'react-icons/ai';
import { IoIosPerson, IoIosHeartEmpty } from 'react-icons/io';
import { LuLogOut, LuShoppingCart } from 'react-icons/lu';

import defaultProfileImage from '@/assets/images/profile.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogoutMutation } from '@/hooks/useAuthMutations';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useAuthStore } from '@/store/authStore';

import type { StaticImageData } from 'next/image';

export const ProfileDropdownNext = () => {
	const { nickname } = useAuthStore();
	const logoutMutation = useLogoutMutation();
	const router = useRouter();

	const handleLogout = async () => {
		router.replace('/');
		await logoutMutation.mutateAsync();
	};

	const { data: userData } = useAuthQuery();
	const userProfileImage = userData?.profileImage || defaultProfileImage;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
					<Avatar className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border-none bg-transparent">
						<AvatarImage
							src={
								typeof userProfileImage === 'string'
									? userProfileImage
									: (userProfileImage as StaticImageData).src
							}
							alt="User Avatar"
						/>
						<AvatarFallback className="bg-transparent">
							<IoIosPerson className="w-7 h-7 text-foreground/80" />
						</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel>{nickname} 님</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex gap-1" onClick={() => router.push('/mypage')}>
					<AiOutlineUser />
					마이페이지
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex gap-1"
					onClick={() => router.push('/mypage/class/orders')}
				>
					<LuShoppingCart />
					클래스 결제 내역
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex gap-1" onClick={() => router.push('/chats')}>
					<AiOutlineMessage />
					메시지
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex gap-1"
					onClick={() => router.push('/mypage/class/wish-list')}
				>
					<IoIosHeartEmpty />
					위시리스트
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
