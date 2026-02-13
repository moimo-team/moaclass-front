import { useState } from 'react';

import { Pencil } from 'lucide-react';

import { TeacherProfileModal } from '@/components/features/modal/profile/TeacherProfileModal';
import { Button } from '@/components/ui/button';
import type { TeacherProfile } from '@/models/lesson.model';

// Mock 데이터 (나중에 API로 교체)
const MOCK_TEACHER_PROFILE: TeacherProfile | null = null;

const TeacherProfilePage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(
		MOCK_TEACHER_PROFILE,
	);

	const handleSave = (profile: TeacherProfile) => {
		setTeacherProfile(profile);
		setIsModalOpen(false);
	};

	// 프로필이 없으면 등록 안내
	if (!teacherProfile) {
		return (
			<div className="w-full flex items-center justify-center py-20">
				<div className="text-center space-y-6 max-w-md">
					<div className="space-y-2">
						<h2 className="text-2xl font-bold text-gray-900">모멘토 프로필 등록</h2>
						<p className="text-gray-600">
							클래스를 등록하려면 먼저 모멘토 프로필을 등록해주세요.
						</p>
					</div>
					<Button
						size="lg"
						className="bg-primary hover:bg-primary/90"
						onClick={() => setIsModalOpen(true)}
					>
						선생님 프로필 등록하기
					</Button>
				</div>

				<TeacherProfileModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onSave={handleSave}
					profile={null}
				/>
			</div>
		);
	}

	// 프로필이 있으면 보여주기
	return (
		<div className="w-full">
			<div className="space-y-12">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h3 className="text-2xl font-bold text-gray-900">모멘토 프로필</h3>
					<Button
						variant="outline"
						className="border-primary text-gray-900 hover:bg-primary/10"
						onClick={() => setIsModalOpen(true)}
					>
						<Pencil className="w-4 h-4 mr-2 text-primary" />
						프로필 수정
					</Button>
				</div>

				{/* 프로필 이미지 */}
				<div className="flex items-center gap-6">
					<div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
						{teacherProfile.image ? (
							<img
								src={teacherProfile.image}
								alt={teacherProfile.nickname}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-gray-400">
								No Image
							</div>
						)}
					</div>
					<div>
						<h4 className="text-xl font-bold text-gray-900">
							{teacherProfile.nickname}
						</h4>
						<p className="text-sm text-gray-500">선생님 활동명</p>
					</div>
				</div>

				{/* Introduction */}
				<div>
					<h4 className="text-lg font-medium text-gray-900 mb-4">소개</h4>
					<div className="p-4 bg-gray-50 rounded-lg min-h-[200px] whitespace-pre-wrap text-gray-700 border border-gray-100">
						{teacherProfile.introduction}
					</div>
					<p className="text-xs text-gray-400 mt-2">
						{teacherProfile.introduction.length}자 / 40~600자
					</p>
				</div>
			</div>

			<TeacherProfileModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				profile={teacherProfile}
			/>
		</div>
	);
};

export default TeacherProfilePage;
