import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Crown, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ProfileModal from "@/components/features/mypage/ProfileModal";
import { useUserInfoQuery } from "@/hooks/useUserInfoQuery";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: userInfo, isLoading } = useUserInfoQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-full py-10 bg-white overflow-y-auto">
      {/* Top Stats Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-yellow-400">
            {userInfo?.nickname || "프로모이머"}
          </h1>
          <Crown className="w-8 h-8 text-yellow-600 fill-yellow-600" />
        </div>

        <Link to="/mypage/meetings/join" className="text-gray-900 font-medium hover:underline flex items-center gap-1">
          어떤 만남이 있었을까요? &gt;
        </Link>
      </div>

      <Separator className="bg-gray-200 mb-12" />

      {/* Profile Section */}
      <div className="space-y-12 ">
        {/* Basic Profile Edit Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">프로필</h3>
          <Button
            variant="outline"
            className="border-yellow-400 text-gray-900 hover:bg-yellow-50"
            onClick={() => setIsModalOpen(true)}
          >
            <Pencil className="w-4 h-4 mr-2 text-yellow-500" />
            프로필 수정
          </Button>
        </div>

        {/* Interests Section */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">관심사</h4>
          <div className="flex flex-wrap gap-2">
            {userInfo?.interests?.map((interest) => (
              <Badge
                key={interest.id}
                variant="secondary"
                className="bg-orange-200 text-orange-800 hover:bg-orange-300 px-4 py-1.5 text-sm font-normal rounded-md"
              >
                {interest.name}
              </Badge>
            ))}
            {(!userInfo?.interests || userInfo.interests.length === 0) && (
              <p className="text-sm text-gray-400">선택된 관심사가 없습니다.</p>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">자기소개</h4>
          <div className="p-4 bg-gray-50 rounded-lg min-h-[120px] whitespace-pre-wrap text-gray-700 border border-gray-100">
            {userInfo?.bio || "자기소개가 없습니다."}
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userInfo={userInfo}
      />
    </div>
  );
}

export default Profile;
