import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchLessons } from '@/api/lesson.api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ClassManageCard } from '@/components/features/class-manage/ClassManageCard';
import { CreateClassButton } from '@/components/features/class-manage/CreateClassButton';
import AlertNotification from '@/components/features/modal/AlertNotification';
import ConfirmDialog from '@/components/features/modal/ConfirmDialog';
import CreateClassModal from '@/components/features/modal/create/CreateClassModal';
import { TeacherProfileModal } from '@/components/features/modal/profile/TeacherProfileModal';
import { useDeleteLessonMutation } from '@/hooks/useLessonMutations';
import { useTeacherProfileQuery } from '@/hooks/useTeacherProfileMutations';
import { useToggleLessonStatusMutation } from '@/hooks/useToggleLessonStatusMutation';
import type { Lesson, FetchLessonsResponse } from '@/models/lesson.model';
import { useAuthStore } from '@/store/authStore';

export const ClassManagementContent = () => {
	const router = useRouter();
	const userId = useAuthStore((state) => state.userId);
	const { data: teacherProfile } = useTeacherProfileQuery(userId ?? undefined);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [profileAlertOpen, setProfileAlertOpen] = useState(false);
	const [editingClassId, setEditingClassId] = useState<number | null>(null);
	const [editingIsDraft, setEditingIsDraft] = useState(false);
	const [duplicatingClassId, setDuplicatingClassId] = useState<number | null>(null);
	const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

	const {
		data: lessonsResponse,
		isLoading,
		isError,
	} = useQuery<FetchLessonsResponse>({
		queryKey: ['lessons', 'manage-list', userId],
		queryFn: () =>
			fetchLessons({
				userId: userId ?? undefined,
				status: ['ACTIVE', 'INACTIVE', 'DRAFT', 'DUPLICATED'],
			}),
		refetchOnMount: 'always',
		enabled: !!userId,
	});

	const { mutate: deleteLesson } = useDeleteLessonMutation();
	const { mutate: toggleStatusMutation } = useToggleLessonStatusMutation();

	const lessons = lessonsResponse?.data ?? [];

	const handleEdit = (id: number, status: string) => {
		setEditingClassId(id);
		setEditingIsDraft(status === 'DRAFT');
		setCreateModalOpen(true);
	};

	const handleDeleteClick = (id: number) => {
		setSelectedClassId(id);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (selectedClassId) {
			deleteLesson(selectedClassId, {
				onSuccess: () => {
					setDeleteDialogOpen(false);
					setSelectedClassId(null);
				},
			});
		}
	};

	const handleDuplicate = (id: number) => {
		if (!teacherProfile) {
			setProfileAlertOpen(true);
			return;
		}
		setSelectedClassId(id);
		setDuplicateDialogOpen(true);
	};

	const handleDuplicateConfirm = () => {
		if (selectedClassId) {
			setDuplicatingClassId(selectedClassId);
			setDuplicateDialogOpen(false);
			setSelectedClassId(null);
			setCreateModalOpen(true);
		}
	};

	const handleManage = (id: number) => {
		router.push(`/lessons/${id}/schedule`);
	};

	const handleViewClass = (id: number) => {
		router.push(`/lessons/${id}`);
	};

	const handleToggleStatus = (id: number) => {
		setSelectedClassId(id);
		setStatusDialogOpen(true);
	};

	const handleStatusConfirm = () => {
		if (selectedClassId) {
			const lesson = lessons.find((l) => l.id === selectedClassId);
			if (lesson) {
				toggleStatusMutation({
					lessonId: selectedClassId,
					currentStatus: lesson.status,
				});
			}
			setStatusDialogOpen(false);
			setSelectedClassId(null);
		}
	};

	const handleModalClose = () => {
		setCreateModalOpen(false);
		setEditingClassId(null);
		setEditingIsDraft(false);
		setDuplicatingClassId(null);
	};

	const handleCreateClick = () => {
		if (!teacherProfile) {
			setProfileAlertOpen(true);
			return;
		}
		setCreateModalOpen(true);
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return (
			<div className="py-20 text-center">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
				</div>
				<h3 className="text-xl font-bold text-gray-900 mb-2">
					클래스 목록을 불러오지 못했습니다.
				</h3>
				<p className="text-gray-500 mb-6">잠시 후 다시 시도해주세요.</p>
				<button
					onClick={() => window.location.reload()}
					className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
				>
					다시 시도하기
				</button>
			</div>
		);
	}

	// 멘토 프로필이 없는 경우 안내 화면 표시
	if (!isLoading && !teacherProfile) {
		return (
			<div className="w-full max-w-2xl mx-auto py-16 text-center">
				<h1 className="text-3xl font-nanum-bold mb-4 text-gray-900 leading-tight">
					클래스 목록을 불러오기 위해서는
					<br />
					<span className="text-primary underline underline-offset-8">모멘토 프로필</span>
					을 먼저 작성해야 해요.
				</h1>

				<p className="text-gray-500 mb-10 text-lg leading-relaxed">
					프로필은 수강생들이 선생님을 처음 만나는 곳입니다.
					<br />
					신뢰감을 주는 활동명과 상세한 소개로 모멘토님의 매력을 보여주세요!
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => setIsProfileModalOpen(true)}
						className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-hover hover:scale-105 transition-all shadow-lg shadow-primary/20"
					>
						지금 프로필 작성하기
					</button>
					<button
						onClick={() => router.push('/')}
						className="px-10 py-4 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
					>
						나중에 하기
					</button>
				</div>

				<TeacherProfileModal
					isOpen={isProfileModalOpen}
					onClose={() => setIsProfileModalOpen(false)}
					profile={null}
				/>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="mb-8">
				<h1 className="text-3xl font-nanum-bold mb-2">클래스 관리</h1>
				<p className="text-muted-foreground">원데이 클래스를 생성하고 관리하세요</p>
			</div>

			{/* 클래스 그리드: 320px 아래로 작아지지 않게 하여 큼직하게 유지 */}
			<div
				className="grid gap-8"
				style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 2fr))' }}
			>
				<CreateClassButton onClick={handleCreateClick} />

				{lessons.map((lesson: Lesson) => (
					<ClassManageCard
						key={lesson.id}
						lesson={lesson}
						onEdit={() => handleEdit(lesson.id, lesson.status)}
						onDelete={() => handleDeleteClick(lesson.id)}
						onDuplicate={() => handleDuplicate(lesson.id)}
						onManage={() => handleManage(lesson.id)}
						onViewClass={() => handleViewClass(lesson.id)}
						onToggleStatus={() => handleToggleStatus(lesson.id)}
					/>
				))}
			</div>

			{/* 삭제 확인 다이얼로그 */}
			<ConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title="클래스 삭제"
				description="정말로 이 클래스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
				confirmText="삭제"
				onConfirm={handleDeleteConfirm}
				variant="destructive"
			/>

			{/* 상태 변경 다이얼로그 */}
			<ConfirmDialog
				open={statusDialogOpen}
				onOpenChange={setStatusDialogOpen}
				title="클래스 상태 변경"
				description={
					selectedClassId &&
					lessons.find((l) => l.id === selectedClassId)?.status === 'ACTIVE'
						? '이 클래스를 휴면 상태로 전환하시겠습니까?'
						: '이 클래스를 활성화하시겠습니까?'
				}
				confirmText="확인"
				onConfirm={handleStatusConfirm}
			/>

			{/* 복제 확인 다이얼로그 */}
			<ConfirmDialog
				open={duplicateDialogOpen}
				onOpenChange={setDuplicateDialogOpen}
				title="클래스 복제"
				description="해당 클래스를 복제하시겠습니까?"
				confirmText="복제"
				onConfirm={handleDuplicateConfirm}
			/>

			{/* 클래스 생성/수정 모달 */}
			<CreateClassModal
				open={createModalOpen}
				onOpenChange={handleModalClose}
				classId={editingClassId || duplicatingClassId || undefined}
				isDuplicating={!!duplicatingClassId}
				isDraft={editingIsDraft}
			/>

			{/* 프로필 미등록 안내 */}
			<AlertNotification
				open={profileAlertOpen}
				onOpenChange={setProfileAlertOpen}
				title="모멘토 프로필 등록 필요"
				description={
					<>
						클래스를 등록하려면 먼저 모멘토 프로필을 등록해주세요.
						<br />
						좌측 메뉴에서 '모멘토 프로필' 탭을 선택하여 프로필을 등록할 수 있습니다.
					</>
				}
				hasButton={true}
			/>
		</div>
	);
};

const ClassManagementPage = () => {
	return <ClassManagementContent />;
};

export default ClassManagementPage;
