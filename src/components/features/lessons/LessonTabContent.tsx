import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import KakaoMapView from "@/components/features/map/kakaoMaps/KakaoMapView";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Review } from "@/models/review.model";
import { ReviewList } from "@components/features/lessons/ReviewList";
import defaultProfileImage from "@/assets/images/profile.png";

interface LessonTabContentProps {
  activeTab: string;
  tabTitles: { id: string; title: string }[];
  handleTabClick: (id: string) => void;
  onSectionRef: (id: string, el: HTMLElement | null) => void;
  description: string;
  curriculum: string;
  teacher:
    | {
        id: number;
        nickname: string;
        image: string;
        introduction: string;
      }
    | undefined;
  latitude: number;
  longitude: number;
  address: string;
  detailAddress: string;
  directionsText: string;
  navigate: ReturnType<typeof useNavigate>;
  reviews: Review[];
}

export const LessonTabContent = ({
  activeTab,
  tabTitles,
  handleTabClick,
  onSectionRef,
  description,
  curriculum,
  teacher,
  latitude,
  longitude,
  address,
  detailAddress,
  directionsText,
  navigate,
  reviews,
}: LessonTabContentProps) => {
  return (
    <>
      {/* 탭 네비게이션 */}
      <div className="sticky top-0 bg-background z-10 border-b border-border/50">
        <div className="flex overflow-x-auto scrollbar-hide py-2">
          {tabTitles.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "whitespace-nowrap rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 text-base sm:text-lg font-medium text-muted-foreground transition-colors hover:text-foreground",
                activeTab === tab.id && "border-primary text-foreground",
              )}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.title}
            </Button>
          ))}
        </div>
      </div>

      {/* 클래스 정보 섹션 */}
      <div className="space-y-8">
        <section id="intro" ref={(el) => onSectionRef("intro", el)}>
          <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
            <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
              <CardTitle className="text-xl font-bold">클래스 소개</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                {description}
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="curriculum" ref={(el) => onSectionRef("curriculum", el)}>
          <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
            <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
              <CardTitle className="text-xl font-bold">커리큘럼</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                {curriculum}
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="momento" ref={(el) => onSectionRef("momento", el)}>
          <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
            <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
              <CardTitle className="text-xl font-bold">모멘토 소개</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {teacher && (
                <div className="flex items-center gap-4 mb-6 p-4 border rounded-lg bg-secondary/10">
                  <img
                    src={teacher.image || defaultProfileImage}
                    alt={teacher.nickname}
                    className="w-20 h-20 rounded-full object-cover border border-border flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">
                      {teacher.nickname}
                    </h3>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary text-sm hover:underline"
                      onClick={() => navigate(`/mypage/profile/${teacher.id}`)}
                    >
                      모멘토 페이지 바로가기
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                {teacher?.introduction || "모멘토 소개가 없습니다."}
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="location" ref={(el) => onSectionRef("location", el)}>
          <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
            <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
              <CardTitle className="text-xl font-bold">위치</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-96 bg-muted">
                <KakaoMapView
                  lat={latitude}
                  lng={longitude}
                  placeName={address}
                  level={3}
                />
              </div>
              <div className="p-4 bg-card border-t border-border/50">
                <p className="text-base font-medium text-foreground flex items-center gap-2">
                  <FaMapMarkerAlt className="w-5 h-5 text-primary" />
                  {address} {detailAddress}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {directionsText}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="reviews" ref={(el) => onSectionRef("reviews", el)}>
          <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
            <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
              <CardTitle className="text-xl font-bold">후기</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ReviewList reviews={reviews} />
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
};
