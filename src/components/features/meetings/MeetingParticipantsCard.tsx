import { useState, useMemo } from "react";
import { useParticipationQuery } from "@/hooks/useParticipationQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Crown, User } from "lucide-react";
import ProfileModal from "../mypage/ProfileModal";
import type { MeetingDetail } from "@/models/meeting.model";
import defaultProfile from "@/assets/images/profile.png";

// 화면에 표시할 참여자 정보 (API 응답 기반)
type DisplayParticipant = {
  userId: number;
  nickname: string;
  profileImage: string | null;
  bio: string | null;
  isHost: boolean;
};

interface ParticipantsCardProps {
  meetingId: number;
  host: MeetingDetail["host"];
  currentParticipants: number;
  maxParticipants: number;
}

export function MeetingParticipantsCard({ meetingId, host, currentParticipants, maxParticipants }: ParticipantsCardProps) {
  const { data: participants = [] } = useParticipationQuery(meetingId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // 참여자 목록 정렬 및 가공
  const { hostParticipant, guests } = useMemo(() => {
    // 모이머
    const hostParticipant = participants.find(p => p.isHost);

    // 모이미만 있는 목록
    const guests = participants.filter(p => !p.isHost);

    return { hostParticipant, guests };
  }, [participants]);

  // 최종 호스트 정보 (API 응답 우선, 없으면 MeetingDetail의 host 사용)
  const finalHost: DisplayParticipant = hostParticipant
    ? {
      userId: hostParticipant.userId,
      nickname: hostParticipant.nickname,
      profileImage: hostParticipant.profileImage,
      bio: hostParticipant.bio,
      isHost: true
    }
    : {
      userId: host.hostId,
      nickname: host.nickname,
      profileImage: host.hostImage,
      bio: host.bio,
      isHost: true
    };

  // 보여줄 게스트 목록 계산 (기본 10명 = 5x2, 확장 시 전체)
  const visibleGuests = isExpanded ? guests : guests.slice(0, 10);

  const handleUserClick = (userId: number) => {
    if (userId > 0) {
      setSelectedUserId(userId);
    }
  };

  return (
    <>
      <Card className="w-full border-2 border-border/50 shadow-sm overflow-hidden rounded-xl">
        <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              참여자 <span className="text-primary">{currentParticipants}/{maxParticipants}</span>
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* 왼쪽: 모이머 (호스트) */}
            <div className="flex-shrink-0 w-[200px]">
              <div className="border-r border-border/30 pr-6">
                <div
                  onClick={() => handleUserClick(finalHost.userId)}
                  className="flex flex-col items-center gap-3 p-4 hover:bg-muted/30 cursor-pointer transition-colors rounded-lg"
                >
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-primary bg-muted flex items-center justify-center">
                      <AvatarImage src={finalHost.profileImage || defaultProfile} className="object-cover" />
                      <AvatarFallback className="bg-transparent">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    {/* 호스트 뱃지 */}
                    <div className="absolute -top-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-sm border-2 border-white">
                      <Crown className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>

                  <div className="text-center w-full">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="font-bold text-lg truncate">
                        {finalHost.nickname}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-2 py-0.5">
                      모이머
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {finalHost.bio || "모임장입니다."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 모이미들 (게스트) */}
            <div className="flex-1">
              {guests.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  아직 참여한 모이미가 없습니다.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-5 gap-2">
                    {visibleGuests.map((guest) => (
                      <div
                        key={guest.userId}
                        onClick={() => handleUserClick(guest.userId)}
                        className="flex flex-col items-center gap-2 p-2 hover:bg-muted/30 cursor-pointer transition-colors rounded-lg"
                      >
                        <Avatar className="w-16 h-16 border border-border bg-muted flex items-center justify-center">
                          <AvatarImage src={guest.profileImage || defaultProfile} className="object-cover" />
                          <AvatarFallback className="bg-transparent">
                            <User className="w-8 h-8 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="text-center w-full">
                          <span className="font-medium text-sm truncate block">
                            {guest.nickname}
                          </span>
                          <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0 h-4 border-border mt-1">
                            모이미
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 더보기 버튼 */}
                  {guests.length > 10 && (
                    <Button
                      variant="ghost"
                      className="w-full mt-3 h-9 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? (
                        <span className="flex items-center gap-2 text-sm">접기 <ChevronUp className="w-4 h-4" /></span>
                      ) : (
                        <span className="flex items-center gap-2 text-sm">더보기 (+{guests.length - 10}명) <ChevronDown className="w-4 h-4" /></span>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프로필 모달 */}
      {selectedUserId && (
        <ProfileModal
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          userId={selectedUserId}
          readOnly={true}
        />
      )}
    </>
  );
}
