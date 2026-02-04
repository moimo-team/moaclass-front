import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import FormField from "@components/common/FormField";
import { useCreateMeetingMutation, useUpdateMeetingMutation } from "@/hooks/useMeetingMutations";
import { useMeetingQuery } from "@/hooks/useMeetingQuery";
import DateTimePicker from "@components/common/DateTimePicker";
import KakaoMapSearch from "@/components/features/meetings/kakaoMaps/KakaoMapSearch";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Meeting, MeetingDetail } from "@/models/meeting.model";
import type { MyMeetingsResponse } from "@/api/me.api";
import LoadingSpinner from "@components/common/LoadingSpinner";
import { useInterestQuery } from "@/hooks/useInterestQuery";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import type { PlaceInfo } from "@/models/kakao-maps.model";

// Zod 스키마 정의
const meetingSchema = z.object({
  title: z.string().min(1, "모임명을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  description: z.string().min(1, "모임 소개를 입력해주세요").max(4000, "4000자 이내로 입력해주세요"),
  interestId: z.number({ message: "관심사를 선택해주세요" }),
  maxParticipants: z.number(),
  meetingDate: z.date({ message: "날짜를 선택해주세요" }),
  meetingHour: z.string(),
  meetingMinute: z.string(),
  meetingPeriod: z.enum(["AM", "PM"]),
  address: z.string().min(1, "모임 장소를 입력해주세요"),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

interface CreateMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Meeting | MyMeetingsResponse | MeetingDetail;
}

function CreateMeetingModal({ open, onOpenChange, meeting }: CreateMeetingModalProps) {
  const navigate = useNavigate();
  const { data: interests } = useInterestQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);

  const { data: meetingDetail, isLoading: isMeetingLoading } = useMeetingQuery(
    open && meeting ? ('meetingId' in meeting ? meeting.meetingId : (meeting as { id: number }).id) : undefined
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      interestId: undefined,
      maxParticipants: 15,
      meetingDate: undefined,
      meetingHour: "3",
      meetingMinute: "00",
      meetingPeriod: "PM",
      address: "",
    }
  });

  const createMeetingMutation = useCreateMeetingMutation();
  const updateMeetingMutation = useUpdateMeetingMutation();



  // 폼 데이터 감시
  const selectedInterestId = watch("interestId");
  const maxParticipants = watch("maxParticipants");
  const meetingDate = watch("meetingDate");
  const meetingHour = watch("meetingHour");
  const meetingMinute = watch("meetingMinute");
  const meetingPeriod = watch("meetingPeriod");

  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (open) {
      if (meeting) {
        // 수정 모드: 데이터가 로드되면 폼 초기화
        if (meetingDetail) {
          // 시간 파싱
          let date = new Date();
          let hourStr = "12";
          let minuteStr = "00";
          let periodVal: "AM" | "PM" = "PM";

          if (meetingDetail.meetingDate) {
            date = new Date(meetingDetail.meetingDate);
            const hour = date.getHours();
            const minute = date.getMinutes();
            periodVal = hour >= 12 ? "PM" : "AM";
            const displayHour = hour % 12 || 12;

            hourStr = String(displayHour);
            minuteStr = String(minute).padStart(2, "0");
          }

          reset({
            title: meetingDetail.title,
            description: meetingDetail.description || "",
            interestId: meetingDetail.interestId,
            maxParticipants: meetingDetail.maxParticipants,
            meetingDate: meetingDetail.meetingDate ? new Date(meetingDetail.meetingDate) : undefined,
            meetingHour: hourStr,
            meetingMinute: minuteStr,
            meetingPeriod: periodVal,
            address: meetingDetail.location.address,
          });
          setPreviewImage(meetingDetail.meetingImage || null);
          setIsFormReady(true);
        } else {
          // 데이터 로딩 중
          setIsFormReady(false);
        }
      } else {
        // 새 모임 생성: 즉시 준비 완료
        reset({
          title: "",
          description: "",
          interestId: undefined,
          maxParticipants: 15,
          meetingDate: undefined,
          meetingHour: "12",
          meetingMinute: "00",
          meetingPeriod: "PM",
          address: "",
        });
        setPreviewImage(null);
        setIsFormReady(true);
      }
    } else {
      setIsFormReady(false);
    }
  }, [open, meeting, meetingDetail, interests, reset]);

  // 이미지 변경
  const MAX_IMAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("지원하는 이미지 형식만 업로드할 수 있어요", {
        description: "JPG, PNG, WebP, GIF 형식만 가능합니다"
      });
      e.target.value = "";
      return;
    }

    // Mac NFD 파일명 정규화
    const normalizedFileName = file.name.normalize('NFC');
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(normalizedFileName);
    if (hasKorean) {
      toast.error("이미지 파일명이 한글인 경우 업로드할 수 없어요", {
        description: "파일명을 영문으로 변경해주세요"
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("이미지 크기가 너무 큽니다", {
        description: "4.5MB 이하의 이미지만 업로드 가능합니다"
      });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 장소 선택 핸들러
  const handlePlaceSelect = (place: PlaceInfo) => {
    setValue("address", place.roadAddress || place.address, { shouldValidate: true });
  };

  // 관심사 토글
  const toggleInterest = (interestId: number) => {
    setValue(
      "interestId",
      (selectedInterestId === interestId ? undefined : interestId) as any,
      { shouldValidate: true }
    );
  };

  // 폼 제출
  const onSubmit = async (data: MeetingFormValues) => {
    const confirmed = window.confirm(
      meeting ?
        "모임을 수정하시겠습니까?"
        :
        "모임을 생성하시겠습니까?\n신청 내용은 마이페이지에서 언제든지 수정 가능합니다."
    );

    if (!confirmed) {
      return;
    }

    try {
      // 날짜와 시간 결합
      const combinedDateTime = new Date(data.meetingDate!);
      let hour24 = parseInt(data.meetingHour);
      if (data.meetingPeriod === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (data.meetingPeriod === "AM" && hour24 === 12) {
        hour24 = 0;
      }
      combinedDateTime.setHours(hour24);
      combinedDateTime.setMinutes(parseInt(data.meetingMinute));

      // FormData 생성 (사용자 가이드 명세 준수)
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("maxParticipants", String(data.maxParticipants));

      // 명세 양식 (YYYY-MM-DDTHH:mm:ss) 맞춤 (초 단위까지 포함)
      // 명세 양식 (YYYY-MM-DDTHH:mm:ss) 맞춤 - 로컬 시간 기준 유지
      const year = combinedDateTime.getFullYear();
      const month = String(combinedDateTime.getMonth() + 1).padStart(2, '0');
      const day = String(combinedDateTime.getDate()).padStart(2, '0');
      const hours = String(combinedDateTime.getHours()).padStart(2, '0');
      const minutes = String(combinedDateTime.getMinutes()).padStart(2, '0');
      const seconds = String(combinedDateTime.getSeconds()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      formData.append("meetingDate", formattedDate);

      formData.append("interestId", String(data.interestId));
      formData.append("address", data.address);

      // 이미지 파일 처리 (meetingImage 복구)
      const imageFile = fileInputRef.current?.files?.[0];
      if (imageFile) {
        formData.append("meetingImage", imageFile);
      }

      if (meeting) {
        // meetingId 추출
        const mid = 'meetingId' in meeting ? meeting.meetingId : (meeting as { id: number }).id;

        await updateMeetingMutation.mutateAsync({
          id: mid,
          data: formData
        });
        toast.success("모임이 수정되었습니다!");
        onOpenChange(false);
      } else {
        await createMeetingMutation.mutateAsync(formData);
        toast.success("모임이 생성되었습니다!", {
          description: "마이페이지 - 내 모임에서 확인할 수 있습니다!"
        });
        onOpenChange(false);
        navigate("/");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      const serverData = error.response?.data;
      const serverMessage = serverData?.message || serverData?.error;
      const displayMessage = Array.isArray(serverMessage)
        ? serverMessage.join("\n")
        : serverMessage;

      toast.error("모임 생성에 실패했습니다", {
        description: displayMessage || "입력 정보를 확인해주세요"
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-card flex flex-col p-0">
          <DialogHeader className="sticky top-0 bg-card z-10 px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                {meeting ? "모임 정보 수정하기" : "모이머 신청하기"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {meeting ? "모임 정보를 수정하는 양식입니다." : "새로운 모임을 신청하는 양식입니다."}
              </DialogDescription>
              <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-5 w-5" />
                <span className="sr-only">닫기</span>
              </DialogClose>
            </div>
          </DialogHeader>

          {(isMeetingLoading || !isFormReady) ? (
            <div className="overflow-y-auto px-6 pb-6 scrollbar-hide">
              <div className="flex h-[400px] items-center justify-center">
                <LoadingSpinner />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
                {/* 모임명 */}
                <FormField label="모임명" htmlFor="title">
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="표현하고 싶은 모임명을 입력하세요! (100자 이내)"
                    className="h-12"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                </FormField>

                {/* 모임 소개글 */}
                <FormField label="모임 소개글" htmlFor="description">
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="모임에 대해 자유롭게 설명해주세요! (4000자 이내)&#10;ex) (필수) 모임의 정확한 위치, 개성적인 특징, 참여자가 가지면 좋은 마인드, 지켜야 할 사항"
                    className="min-h-[120px] resize-none"
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                </FormField>

                {/* 관심사 선택 */}
                <FormField
                  label="관심사"
                  description="모임과 관련된 관심사를 선택해주세요"
                >
                  <div className="flex flex-wrap gap-2">
                    {interests?.map((interest) => (
                      <Badge
                        key={interest.id}
                        variant={selectedInterestId === interest.id ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-colors px-4 py-2 text-sm",
                          selectedInterestId === interest.id
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-secondary"
                        )}
                        onClick={() => toggleInterest(interest.id)}
                      >
                        {interest.name}
                        {selectedInterestId === interest.id && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {errors.interestId && <p className="text-xs text-red-500 mt-1">{errors.interestId.message}</p>}
                </FormField>

                {/* 모임 대표 사진 */}
                <FormField label="모임 대표 사진" description="모임을 대표할 사진을 선택해주세요 (4.5MB 이하 영문 파일명만 가능)">
                  <div className="flex items-center gap-4">


                    {/* 업로드 버튼 */}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground border-none"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {previewImage ? "이미지 변경" : "이미지 찾기"}
                    </Button>
                    {/* 이미지 미리보기 (ProfileModal 스타일) */}
                    {previewImage && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </FormField>

                {/* 모임 날짜 및 시간 */}
                <FormField label="모임 날짜 및 시간" description="모임이 진행될 날짜와 시간을 선택해주세요">
                  <DateTimePicker
                    date={meetingDate}
                    hour={meetingHour}
                    minute={meetingMinute}
                    period={meetingPeriod}
                    onDateChange={(date) => setValue("meetingDate", date as any, { shouldValidate: true })}
                    onHourChange={(hour) => setValue("meetingHour", hour)}
                    onMinuteChange={(minute) => setValue("meetingMinute", minute)}
                    onPeriodChange={(period) => setValue("meetingPeriod", period)}
                  />
                  {errors.meetingDate && <p className="text-xs text-red-500 mt-1">{errors.meetingDate.message}</p>}
                </FormField>

                {/* 모임 장소 */}
                <FormField
                  label="모임 장소"
                  description="카카오맵에서 장소를 검색하여 선택해주세요"
                >
                  <KakaoMapSearch
                    onPlaceSelect={handlePlaceSelect}
                    defaultValue={watch("address")}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                </FormField>

                {/* 최대 인원수 */}
                <FormField
                  label="최대 인원수"
                  description="수용할 수 있는 인원수 만큼만 받는게 중요해요!"
                >
                  <div className="space-y-4">
                    <Slider
                      value={[maxParticipants]}
                      onValueChange={(value) => setValue("maxParticipants", value[0], { shouldValidate: true })}
                      max={50}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-lg font-semibold text-foreground">
                      {maxParticipants}명
                    </p>
                  </div>
                  {errors.maxParticipants && <p className="text-xs text-red-500 mt-1">{errors.maxParticipants.message}</p>}
                </FormField>
              </div>

              {/* Fixed Footer Buttons */}
              <div className="shrink-0 px-6 py-4 border-t bg-card flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-12"
                  disabled={createMeetingMutation.isPending || updateMeetingMutation.isPending}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!isValid || createMeetingMutation.isPending || updateMeetingMutation.isPending}
                >
                  {meeting ?
                    (updateMeetingMutation.isPending ? "수정 중..." : "수정하기") :
                    (createMeetingMutation.isPending ? "신청 중..." : "신청하기")
                  }
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>


    </>
  );
}

export default CreateMeetingModal;
