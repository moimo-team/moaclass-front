import { useState } from "react";
import { ClassManageCard } from "@/components/features/class-manage/ClassManageCard";
import type { ClassCardData } from "@/models/lesson.model";
import { CreateClassButton } from "@/components/features/class-manage/CreateClassButton";
import ConfirmDialog from "@/components/features/modal/ConfirmDialog";
import CreateClassModal from "@/components/features/modal/create/CreateClassModal";
import { toast } from "sonner";
import { formatClassCreateDate } from "@/utils/dateFormat";
import { MOCK_CLASSES } from "@/constants/mockClassData";

const ClassManagementPage = () => {
  const [classes, setClasses] = useState<ClassCardData[]>(MOCK_CLASSES);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    toast.info(`클래스 ${id} 수정 (준비중)`);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedClassId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedClassId) {
      setClasses(classes.filter((c) => c.id !== selectedClassId));
      toast.success("클래스가 삭제되었습니다");
      setDeleteDialogOpen(false);
      setSelectedClassId(null);
    }
  };


  const handleDuplicate = (id: number) => {
    setSelectedClassId(id);
    setDuplicateDialogOpen(true);
  };

  const handleDuplicateConfirm = () => {
    if (selectedClassId) {
      const original = classes.find((c) => c.id === selectedClassId);
      if (original) {
        const newClass: ClassCardData = {
          ...original,
          id: Math.max(...classes.map((c) => c.id)) + 1,
          title: `${original.title} (복제)`,
          status: "INACTIVE", // 복제된 클래스는 마감 상태
          createdAt: formatClassCreateDate(new Date().toISOString()),
        };
        setClasses([newClass, ...classes]);
        toast.success("클래스가 복제되었습니다.(내용 수정에서 클래스를 활성화하세요)");
      }
      setDuplicateDialogOpen(false);
      setSelectedClassId(null);
    }
  };

  const handleManage = (id: number) => {
    toast.info(`클래스 ${id} 관리 페이지 (준비중)`);
  };

  const handleViewClass = (id: number) => {
    toast.info(`클래스 ${id} 상세 페이지 (준비중)`);
  };

  const handleToggleStatus = (id: number) => {
    setSelectedClassId(id);
    setStatusDialogOpen(true);
  };

  const handleStatusConfirm = () => {
    if (selectedClassId) {
      setClasses(classes.map((c) => {
        if (c.id === selectedClassId) {
          const newStatus = c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          toast.success(
            newStatus === "ACTIVE"
              ? "클래스가 활성화되었습니다"
              : "클래스가 휴면 상태로 전환되었습니다"
          );
          return { ...c, status: newStatus };
        }
        return c;
      }));
      setStatusDialogOpen(false);
      setSelectedClassId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-nanum-bold mb-2">클래스 관리</h1>
        <p className="text-muted-foreground">
          원데이 클래스를 생성하고 관리하세요
        </p>
      </div>

      {/* 클래스 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* 클래스 생성 모달 */}
      <CreateClassModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
};

export default ClassManagementPage;
