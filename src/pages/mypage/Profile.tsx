import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Crown, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import UserProfileModal from "@/components/features/modal/profile/UserProfileModal";
import { useUserInfoQuery } from "@/hooks/useUserInfoQuery";
import { REGIONS } from "@/constants/regions";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const MOCK_USER_INFO = {
  id: 1,
  email: "[EMAIL_ADDRESS]",
  nickname: "테스트",
  bio: "안녕하세요",
  regionId: 1,
  profileImage: "",
  categories: [
    {
      id: 1,
      name: "개발",
    },
    {
      id: 2,
      name: "디자인",
    },
  ],
}

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { data: userInfo, isLoading } = useUserInfoQuery();
  const userInfo = MOCK_USER_INFO;
  const isLoading = false;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto w-full h-full py-10 bg-white overflow-y-auto">
      {/* 프로필 섹션 */}
      <div className="space-y-12 ">
        {/* 기본 프로필 수정 헤더 */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">프로필</h3>
          <Button
            variant="outline"
            className="border-primary text-gray-900 hover:bg-primary/10"
            onClick={() => setIsModalOpen(true)}
          >
            <Pencil className="w-4 h-4 mr-2 text-primary" />
            프로필 수정
          </Button>
        </div>

        {/* 선호 카테고리 */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">선호 카테고리</h4>
          <div className="flex flex-wrap gap-2">
            {userInfo?.categories?.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="bg-primary/20 text-primary hover:bg-primary/30 px-4 py-1.5 text-sm font-normal rounded-md"
              >
                {category.name}
              </Badge>
            ))}
            {(!userInfo?.categories || userInfo.categories.length === 0) && (
              <p className="text-sm text-gray-400">선택된 카테고리가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 지역  */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">지역</h4>
          <div className="flex flex-wrap gap-2">
            {userInfo?.regionId && (
              <Badge
                variant="secondary"
                className="bg-primary/60 text-white hover:bg-primary/70 px-4 py-1.5 text-sm font-normal rounded-md"
              >
                {REGIONS.find((region) => region.id === userInfo?.regionId)?.name}
              </Badge>
            )}
            {(!userInfo?.regionId) && (
              <p className="text-sm text-gray-400">선택한 지역이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 자기소개*/}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">자기소개</h4>
          <div className="p-4 bg-gray-50 rounded-lg min-h-[120px] whitespace-pre-wrap text-gray-700 border border-gray-100">
            {userInfo?.bio || "자기소개가 없습니다."}
          </div>
        </div>
      </div>

      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userInfo={userInfo}
      />
    </div>
  );
}

export default Profile;
