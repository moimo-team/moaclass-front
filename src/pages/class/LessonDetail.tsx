import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatClassCreateDate } from "@/utils/dateFormat";
import { useAuthStore } from "@/store/authStore";
import LoginRequiredDialog from "@/components/features/login/LoginRequiredDialog";
import ConfirmDialog from "@/components/features/modal/ConfirmDialog";
import KakaoMapView from "@/components/features/map/kakaoMaps/KakaoMapView";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import StarRating from "@/components/common/StarRating";
import { getLevelDisplayName } from "@/constants/lessonConstants";
import { toast } from "sonner";

import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  //FaHeart, // 위시리스트에 추가된 상태 기능 만들면 추가 (FaHeart 추가)
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
} from "react-icons/fa";

import { useLessonQuery } from "@/hooks/useLessonQuery";
import moimoMeeting from "@/assets/images/moimo-meetings.png";
import { getDisplayAddress } from "@/utils/formatAddress";

export const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: lessonDetail,
    isLoading,
    error,
  } = useLessonQuery(Number(lessonId));

  // --- Image Gallery State (Carousel) ---
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const hasImages =
      lessonDetail?.lessonImages && lessonDetail.lessonImages.length > 0;
    const targetIndex = hasImages ? 0 : -1;

    if (activeIndex !== targetIndex) {
      setActiveIndex(targetIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonDetail?.lessonImages]);

  // Derived state for the main image
  const currentMainImage =
    lessonDetail?.lessonImages &&
    lessonDetail.lessonImages.length > 0 &&
    activeIndex !== -1
      ? lessonDetail.lessonImages[activeIndex].image
      : moimoMeeting;

  const goToPrevImage = () => {
    const images = lessonDetail?.lessonImages;
    if (!images || images.length <= 1) return;

    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNextImage = () => {
    const images = lessonDetail?.lessonImages;
    if (!images || images.length <= 1) return;

    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  // --- Tab Navigation State ---
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeTab, setActiveTab] = useState("intro");
  const tabTitles = [
    { id: "intro", title: "클래스 소개" },
    { id: "curriculum", title: "커리큘럼" },
    { id: "momento", title: "모멘토 소개" },
    { id: "location", title: "위치" },
    { id: "reviews", title: "후기" },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    tabRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 화면 스크롤 시 어떤 섹션이 현재 화면에 보이는지 감지
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, observerOptions);

    Object.values(tabRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(tabRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [lessonDetail]);

  // --- Reservation Sidebar States ---
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );
  const [headcount, setHeadcount] = useState(1);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showConfirmApply, setShowConfirmApply] = useState(false);

  // Helper to format Date to YYYY-MM-DD string
  const formatDateToString = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // TODO: Date Picker Logic (Today to 3 months) 임시로 오늘 ~ 3개월만 신청 가능
  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(today.getMonth() + 3);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(formatDateToString(date));
  };

  const handleHeadcountChange = (amount: number) => {
    setHeadcount((prev) => Math.max(1, Math.min(50, prev + amount)));
  };

  const { isLoggedIn } = useAuthStore();

  // --- Action Button Handlers ---
  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    toast.info("위시리스트 기능 (API 연동 필요)");
    // API Endpoint: POST /api/lessons/{lessonId}/wishlist
    // TODO: API 연동 필요 (위시리스트 기능)
  };

  const handleInquiry = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    navigate("/chats");
    // API Endpoint: POST /api/lessons/{lessonId}/inquiry
    // TODO: API 연동 필요 (문의 기능)
  };

  const handleApplyLesson = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    if (!selectedDate) {
      toast.error("날짜를 선택해주세요.");
      return;
    }
    setShowConfirmApply(true);
  };

  const confirmApplyAction = () => {
    toast.success("클래스 신청이 완료되었습니다!");
    setShowConfirmApply(false);
    // API Endpoint: POST /api/lessons/{lessonId}/reserve
    // TODO: API 연동 필요 (클래스 예약 기능)
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !lessonDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-destructive">
          {error ? (error as Error).message : "클래스을 찾을 수 없습니다."}
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    curriculum,
    level,
    durationMin,
    price,
    discountRate,
    discountedPrice,
    maxParticipants,
    likes,
    address,
    detailAddress,
    directionsText,
    rate,
    lessonImages,
    teacherProfile,
  } = lessonDetail;

  return (
    <div className="flex flex-col min-h-screen bg-background pt-12">
      <div className="flex-1 w-full max-w-7xl mx-auto pb-8 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* 왼쪽 메인 컨테이너 */}
          <div className="md:col-span-2 space-y-8">
            {/* 이미지 섹션 */}
            <section>
              <div className="relative w-full aspect-video md:aspect-[16/9] rounded-xl overflow-hidden bg-muted shadow-sm border border-border/50">
                <img
                  src={currentMainImage}
                  alt={title}
                  className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                />
                {lessonImages && lessonImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
                      onClick={goToPrevImage}
                    >
                      <FaChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
                      onClick={goToNextImage}
                    >
                      <FaChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
              {lessonImages && lessonImages.length > 1 && (
                <div className="mt-4 relative">
                  <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
                    {lessonImages.map((img, index) => (
                      <img
                        key={img.id}
                        src={img.image}
                        alt={title}
                        className={cn(
                          "w-24 h-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-200",
                          activeIndex === index
                            ? "border-primary"
                            : "border-transparent opacity-70 hover:opacity-100",
                        )}
                        onClick={() => setActiveIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 클래스 헤더 섹션 */}
            <section className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-base px-3 py-1.5 font-medium border-primary/20">
                  {lessonDetail.classCategory?.name || "카테고리 없음"}
                </Badge>
                {lessonDetail.subClassCategories &&
                  lessonDetail.subClassCategories.length > 0 &&
                  lessonDetail.subClassCategories.map((subCat) => (
                    <Badge
                      key={subCat.id}
                      variant="outline" // TODO: 대분류, 소분류 확실히 차이나도록 수정하기
                      className="text-primary/80 hover:bg-muted text-base px-3 py-1.5 font-medium border-border/50"
                    >
                      {subCat.name}
                    </Badge>
                  ))}
              </div>
              <h1 className="text-4xl font-bold text-foreground">{title}</h1>
              <div className="flex items-center gap-4 text-lg text-foreground/80">
                <div className="flex items-center gap-1">
                  <FaRegHeart className="text-red-500" />
                  <span>{likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <StarRating rating={rate} starSize={20} />
                  <span>{rate.toFixed(1)}</span>
                </div>
              </div>
            </section>

            <section className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg text-foreground/80 py-4 border-y border-border/50">
              <div className="flex items-center gap-2">
                <FaClock className="text-primary" />
                <span>{durationMin}분</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                <span>{getDisplayAddress(address)}</span>{" "}
              </div>
              <div className="flex items-center gap-2">
                <FaTachometerAlt className="text-primary" />
                <span>{getLevelDisplayName(level)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-primary" />
                <span>최대 {maxParticipants}명</span>
              </div>
            </section>

            {/* 탭 네비게이션 */}
            <div className="sticky top-0 bg-background z-10 border-b border-border/50">
              <div className="flex overflow-x-auto scrollbar-hide py-2">
                {tabTitles.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    className={cn(
                      "whitespace-nowrap rounded-none border-b-2 border-transparent px-4 py-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground",
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
              <section
                id="intro"
                ref={(el) => {
                  if (tabRefs.current) tabRefs.current["intro"] = el;
                }}
              >
                <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
                  <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
                    <CardTitle className="text-xl font-bold">
                      레슨 소개
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                      {description}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section
                id="curriculum"
                ref={(el) => {
                  if (tabRefs.current) tabRefs.current["curriculum"] = el;
                }}
              >
                <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
                  <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
                    <CardTitle className="text-xl font-bold">
                      커리큘럼
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                      {curriculum}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section
                id="momento"
                ref={(el) => {
                  if (tabRefs.current) tabRefs.current["momento"] = el;
                }}
              >
                <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
                  <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
                    <CardTitle className="text-xl font-bold">
                      모멘토 소개
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {teacherProfile && (
                      <div className="flex items-center gap-4 mb-6 p-4 border rounded-lg bg-secondary/10">
                        <img
                          src={
                            teacherProfile.image ||
                            "https://i.pravatar.cc/150?img=dummy" // TODO: 임시 데이터 삭제
                          }
                          alt={teacherProfile.nickname}
                          className="w-20 h-20 rounded-full object-cover border border-border flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">
                            {teacherProfile.nickname}
                          </h3>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-primary text-sm hover:underline"
                            // TODO: URL 확정 시 변경
                            onClick={() =>
                              navigate(
                                `/mypage/profile/${teacherProfile.userId}`,
                              )
                            }
                          >
                            모멘토 페이지 바로가기
                          </Button>
                        </div>
                      </div>
                    )}
                    <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                      {teacherProfile?.introduction ||
                        "모멘토 소개가 없습니다."}
                    </p>
                  </CardContent>
                </Card>
              </section>

              <section
                id="location"
                ref={(el) => {
                  if (tabRefs.current) tabRefs.current["location"] = el;
                }}
              >
                <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
                  <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
                    <CardTitle className="text-xl font-bold">위치</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="w-full h-96 bg-muted">
                      <KakaoMapView
                        lat={lessonDetail.latitude}
                        lng={lessonDetail.longitude}
                        placeName={lessonDetail.address}
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

              <section
                id="reviews"
                ref={(el) => {
                  if (tabRefs.current) tabRefs.current["reviews"] = el;
                }}
              >
                <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
                  <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
                    <CardTitle className="text-xl font-bold">후기</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">
                      {/* TODO: 후기 목록 컴포넌트 추가 */}
                      아직 후기가 없습니다.
                    </p>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>

          {/* 결제 정보 섹션 */}
          <div className="md:col-span-1">
            <div className="sticky top-12 space-y-6">
              <Card className="border-2 border-border/50 shadow-sm overflow-hidden rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">클래스 예약하기</h2>

                <div className="mb-6">
                  <p className="text-lg font-semibold mb-2">날짜 선택</p>
                  <Calendar
                    mode="single"
                    selected={selectedDate ? new Date(selectedDate) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date < today || date > threeMonthsLater}
                    className="rounded-md border mx-auto"
                  />
                </div>

                <div className="bg-secondary/20 p-4 rounded-md text-sm text-muted-foreground mb-6">
                  <p>
                    최소 예약 {lessonDetail.reservationLeadDays}일 전 예약
                    가능합니다.
                  </p>
                  {/* TODO: 인원별 할인 정책 추가 */}
                  <p>인원별 할인 정책은 현재 적용되지 않습니다.</p>
                </div>

                <div className="mb-6">
                  <p className="text-lg font-semibold mb-2">인원 선택</p>
                  <div className="flex items-center justify-between border rounded-md p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleHeadcountChange(-1)}
                      disabled={headcount <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={headcount}
                      readOnly
                      className="w-16 text-center text-lg font-semibold border-none focus-visible:ring-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleHeadcountChange(1)}
                      disabled={headcount >= 50}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="text-right mb-4">
                  {discountRate > 0 && (
                    <div className="flex items-center justify-end gap-2 text-muted-foreground line-through text-sm">
                      <span>{price.toLocaleString()}원</span>
                      <span className="text-red-500 font-semibold">
                        {discountRate}%
                      </span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-primary">
                    {(discountedPrice * headcount).toLocaleString()}원
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    ({headcount}명 기준)
                  </p>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    variant="outline"
                    className="w-full text-lg py-6"
                    onClick={handleWishlistToggle}
                  >
                    <FaRegHeart className="mr-2 text-xl" />
                    위시리스트
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full text-lg py-6"
                    onClick={handleInquiry}
                  >
                    문의하기
                  </Button>
                  <Button
                    className="w-full text-lg py-6 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleApplyLesson}
                    disabled={!selectedDate}
                  >
                    클래스 신청
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <LoginRequiredDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
      />
      <ConfirmDialog
        open={showConfirmApply}
        onOpenChange={setShowConfirmApply}
        title="클래스 신청 확인"
        description={`선택하신 날짜(${selectedDate ? formatClassCreateDate(selectedDate) : "날짜 미선택"})에 ${headcount}명으로 클래스을 신청하시겠습니까?`}
        confirmText="신청하기"
        cancelText="취소"
        onConfirm={confirmApplyAction}
      />
    </div>
  );
};

export default LessonDetail;
