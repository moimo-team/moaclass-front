import { Plus } from "lucide-react";

interface CreateClassButtonProps {
  onClick: () => void;
}

export const CreateClassButton = ({ onClick }: CreateClassButtonProps) => {
  return (
    <div
      onClick={onClick}
      className="group relative border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30 hover:bg-primary/5 hover:border-primary/40 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center w-full aspect-[3/4.2] shadow-sm overflow-hidden"
    >
      <div className="bg-white rounded-full p-5 mb-5 shadow-sm border border-gray-100 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
        <Plus className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
      </div>
      <p className="font-nanum-bold text-lg text-gray-500 group-hover:text-primary transition-colors text-center px-6">
        클래스 추가하기
      </p>

      {/* 장식용 하단 바 */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100/50 group-hover:bg-primary/30 transition-colors duration-500" />
    </div>
  );
};
