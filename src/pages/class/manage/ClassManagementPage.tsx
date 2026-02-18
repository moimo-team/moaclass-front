import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { fetchLessons } from '@/api/lesson.api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ClassManageCard } from '@/components/features/class-manage/ClassManageCard';
import { CreateClassButton } from '@/components/features/class-manage/CreateClassButton';
import AlertNotification from '@/components/features/modal/AlertNotification';
import ConfirmDialog from '@/components/features/modal/ConfirmDialog';
import CreateClassModal from '@/components/features/modal/create/CreateClassModal';
import { useDeleteLessonMutation } from '@/hooks/useLessonMutations';
import { useTeacherProfileQuery } from '@/hooks/useTeacherProfileMutations';
import { useToggleLessonStatusMutation } from '@/hooks/useToggleLessonStatusMutation';
import type { Lesson, FetchLessonsResponse } from '@/models/lesson.model';
import { useAuthStore } from '@/store/authStore';

export interface ClassManagementProps {
	onNavigate: (path: string) => void;
}

export const ClassManagementContent = ({ onNavigate }: ClassManagementProps) => {
	const userId = useAuthStore((state) => state.userId);
	const { data: teacherProfile } = useTeacherProfileQuery(userId ?? undefined);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [profileAlertOpen, setProfileAlertOpen] = useState(false);
	const [editingClassId, setEditingClassId] = useState<number | null>(null);
	const [duplicatingClassId, setDuplicatingClassId] = useState<number | null>(null);
	const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

	const {
		data: lessonsResponse,
		isLoading,
		isError,
	} = useQuery<FetchLessonsResponse>({
		queryKey: ['lessons', 'manage-list'],
		queryFn: () => fetchLessons({}),
		refetchOnMount: 'always',
	});

	const { mutate: deleteLesson } = useDeleteLessonMutation();
	const { mutate: toggleStatusMutation } = useToggleLessonStatusMutation();

	const lessons = lessonsResponse?.data ?? [];

	const handleEdit = (id: number) => {
		setEditingClassId(id);
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
		onNavigate(`/lessons/${id}/schedule`);
	};

	const handleViewClass = (id: number) => {
		onNavigate(`/lessons/${id}`);
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
			<div className="py-10 text-center text-red-500">클래스 목록을 불러오지 못했습니다.</div>
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
						onEdit={() => handleEdit(lesson.id)}
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
	const navigate = useNavigate();

	return <ClassManagementContent onNavigate={(path) => navigate(path)} />;
};

export default ClassManagementPage;
