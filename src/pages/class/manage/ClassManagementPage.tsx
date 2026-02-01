import { useState } from "react";
import { ClassManageCard, type ClassCardData } from "@/components/features/class-manage/ClassManageCard";
import { CreateClassButton } from "@/components/features/class-manage/CreateClassButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatClassCreateDate } from "@/utils/dateFormat";

// Mock 데이터
const MOCK_CLASSES: ClassCardData[] = [
  {
    id: 1,
    title: "좋은 클래스입니다bbbbbbbbbbbbbbbbbbbbbbbbb",
    category: "베이킹",
    thumbnailImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    status: "RECRUITING",
    createdAt: "2026. 1. 28 (수) 16:52",
  },
  {
    id: 2,
    title: "React 심화 과정",
    category: "IT",
    thumbnailImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    status: "RECRUITING",
    createdAt: "2026. 1. 27 (화) 14:30",
  },
  {
    id: 3,
    title: "TypeScript 기초",
    category: "IT",
    thumbnailImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    status: "CLOSED",
    createdAt: "2026. 1. 25 (월) 10:15",
  },
];

const ClassManagementPage = () => {
  const [classes, setClasses] = useState<ClassCardData[]>(MOCK_CLASSES);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);

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
          status: "CLOSED", // 복제된 클래스는 마감 상태
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
          const newStatus = c.status === "RECRUITING" ? "CLOSED" : "RECRUITING";
          toast.success(
            newStatus === "RECRUITING"
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-nanum-bold mb-2">클래스 관리</h1>
          <p className="text-muted-foreground">
            원데이 클래스를 생성하고 관리하세요
          </p>
        </div>

        {/* 클래스 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 생성 버튼 (항상 첫 번째) */}
          <CreateClassButton />

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
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>클래스 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 클래스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 상태 변경 확인 다이얼로그 */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>클래스 상태 변경</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedClassId && classes.find((c) => c.id === selectedClassId)?.status === "RECRUITING"
                ? "이 클래스를 휴면 상태로 전환하시겠습니까?"
                : "이 클래스를 활성화하시겠습니까?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 복제 클래스 다이얼로그 */}
      <AlertDialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>클래스 복제</AlertDialogTitle>
            <AlertDialogDescription>
              해당 클래스를 복제하시겠습니까? 복제된 클래스는 휴면 상태로 설정됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDuplicateConfirm}>복제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassManagementPage;
