import React from 'react';

import { Pencil, Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { TeacherProfile } from '@/models/lesson.model';

interface TeacherProfileSidebarProps {
	profile: TeacherProfile;
	isMe?: boolean;
	onEdit?: () => void;
	onDelete?: () => void;
}

export const TeacherProfileSidebar: React.FC<TeacherProfileSidebarProps> = ({
	profile,
	isMe,
	onEdit,
	onDelete,
}) => {
	return (
		<Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
			<CardContent className="p-8 flex flex-col items-center text-center">
				<Avatar className="w-40 h-40 border-4 border-white shadow-md mb-6">
					<AvatarImage
						src={profile.image}
						alt={profile.nickname}
						className="object-cover"
					/>
					<AvatarFallback className="text-2xl">
						{profile.nickname.charAt(0)}
					</AvatarFallback>
				</Avatar>

				<h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.nickname}</h1>
				<Badge variant="secondary" className="mb-6 px-3 py-1 text-sm font-medium">
					인증된 모멘토
				</Badge>

				<div className="w-full border-t border-gray-50 pt-6 text-left">
					<h3 className="font-bold text-gray-900 mb-4">소개</h3>
					<p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
						{profile.introduction || '소개 내용이 없습니다.'}
					</p>
				</div>

				{isMe && (
					<div className="w-full border-t border-gray-100 pt-4 mt-2 flex gap-2">
						<button
							onClick={onEdit}
							className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-sm py-2 transition-colors"
						>
							<Pencil className="w-3.5 h-3.5" />
							프로필 수정
						</button>
						<div className="w-px bg-gray-100" />
						<button
							onClick={onDelete}
							className="flex-1 flex items-center justify-center gap-1.5 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 rounded-sm py-2 transition-colors"
						>
							<Trash2 className="w-3.5 h-3.5" />
							프로필 삭제
						</button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
