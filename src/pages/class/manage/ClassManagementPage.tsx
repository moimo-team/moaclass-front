import { useState } from "react";
import { ClassManageCard } from "@/components/features/class-manage/ClassManageCard";
import type { ClassCardData } from "@/models/lesson.model";
import { CreateClassButton } from "@/components/features/class-manage/CreateClassButton";
import ConfirmDialog from "@/components/features/modal/ConfirmDialog";
import CreateClassModal from "@/components/features/modal/create/CreateClassModal";
import AlertNotification from "@/components/features/modal/AlertNotification";
import { formatClassCreateDate } from "@/utils/dateFormat";
import { useQuery } from "@tanstack/react-query";
import { fetchLessons } from "@/api/lesson.api";
import { useDeleteLessonMutation } from "@/hooks/useLessonMutations";
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ClassManagementPage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  // 알림 다이얼로그 상태
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  // 레슨 목록 조회
  const { data: lessonsResponse, isLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => fetchLessons({}),
    staleTime: 1000 * 60,
  });

  const { mutate: deleteLesson } = useDeleteLessonMutation();

  // API 데이터를 ClassCardData 형식으로 변환
  const classes: ClassCardData[] = lessonsResponse?.lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    category: lesson.classCategory?.name || "미분류",
    thumbnailImage: lesson.representativeImage,
    status: lesson.status,
    createdAt: formatClassCreateDate(lesson.createdAt),
    price: lesson.price,
    discountRate: lesson.discountRate,
    discountedPrice: lesson.discountedPrice,
  })) || [];

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
        }
      });
    }
  };


  const handleDuplicate = (id: number) => {
    setSelectedClassId(id);
    setDuplicateDialogOpen(true);
  };

  const handleDuplicateConfirm = () => {
    if (selectedClassId) {
      setAlertTitle("준비 중");
      setAlertDescription("클래스 복제 기능은 준비 중입니다.");
      setAlertOpen(true);
      setDuplicateDialogOpen(false);
      setSelectedClassId(null);
    }
  };

  const handleManage = (id: number) => {
    setAlertTitle("준비 중");
    setAlertDescription(`클래스 ${id} 관리 페이지는 준비 중입니다.`);
    setAlertOpen(true);
  };

  const handleViewClass = (id: number) => {
    setAlertTitle("준비 중");
    setAlertDescription(`클래스 ${id} 상세 페이지는 준비 중입니다.`);
    setAlertOpen(true);
  };

  const handleToggleStatus = (id: number) => {
    setSelectedClassId(id);
    setStatusDialogOpen(true);
  };

  const handleStatusConfirm = () => {
    if (selectedClassId) {
      setAlertTitle("준비 중");
      setAlertDescription("상태 변경 기능은 준비 중입니다.");
      setAlertOpen(true);
      setStatusDialogOpen(false);
      setSelectedClassId(null);
    }
  };

  const handleModalClose = () => {
    setCreateModalOpen(false);
    setEditingClassId(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-nanum-bold mb-2">클래스 관리</h1>
        <p className="text-muted-foreground">
          원데이 클래스를 생성하고 관리하세요
        </p>
      </div>

      {/* 클래스 그리드: 320px 아래로 작아지지 않게 하여 큼직하게 유지 */}
      <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 2fr))" }}>
        {/* 생성 버튼 (항상 첫 번째) */}
        <CreateClassButton onClick={() => { setCreateModalOpen(true); /**TODO: 호스트 프로필 생성 유무 판단*/ }} />

        {/* 클래스 카드들 (최신순) */}
        {classes.map((classData) => (
          <ClassManageCard
            key={classData.id}
            classData={classData}
            onEdit={() => handleEdit(classData.id)}
            onDelete={() => handleDeleteClick(classData.id)}
            onDuplicate={() => handleDuplicate(classData.id)}
            onManage={() => handleManage(classData.id)}
            onViewClass={() => handleViewClass(classData.id)}
            onToggleStatus={() => handleToggleStatus(classData.id)}
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
          selectedClassId && classes.find((c) => c.id === selectedClassId)?.status === "ACTIVE"
            ? "이 클래스를 휴면 상태로 전환하시겠습니까?"
            : "이 클래스를 활성화하시겠습니까?"
        }
        confirmText="확인"
        onConfirm={handleStatusConfirm}
      />

      {/* 복제 클래스 다이얼로그 */}
      <ConfirmDialog
        open={duplicateDialogOpen}
        onOpenChange={setDuplicateDialogOpen}
        title="클래스 복제"
        description="해당 클래스를 복제하시겠습니까? 복제된 클래스는 휴면 상태로 설정됩니다."
        confirmText="복제"
        onConfirm={handleDuplicateConfirm}
      />

      {/* 클래스 생성/수정 모달 */}
      <CreateClassModal
        open={createModalOpen}
        onOpenChange={handleModalClose}
        classId={editingClassId || undefined}
      />

      {/* 알림 다이얼로그 */}
      <AlertNotification
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title={alertTitle}
        description={alertDescription}
        autoCloseDuration={2000}
      />
    </div>
  );
};

export default ClassManagementPage;
