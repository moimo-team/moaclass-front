# Vite ➡️ Next.js (App Router) 이관 현황 및 가이드

### 🗂️ Next.js App Router 디렉토리 구조 설계

```
src/app/
├── layout.tsx                    # 루트 레이아웃 (이미 완료)
├── page.tsx                      # 홈 (이미 완료)
├── HomeClient.tsx                # 홈 클라이언트 컴포넌트 (이미 완료)
│
├── (auth)/                       # 라우트 그룹: 인증 관련
│   ├── login/
│   │   └── page.tsx              # 로그인 페이지
│   ├── join/
│   │   └── page.tsx              # 회원가입
│   ├── user-info/
│   │   └── page.tsx              # 추가 정보 입력
│   ├── find-password/
│   │   └── page.tsx              # 비밀번호 찾기
│   ├── reset-password/
│   │   └── page.tsx              # 비밀번호 재설정
│   └── oauth/
│       └── kakao/
│           └── callback/
│               └── page.tsx      # 카카오 OAuth 콜백
│
├── meetings/                     # 모임
│   ├── page.tsx                  # 모임 목록
│   ├── search/
│   │   └── page.tsx              # 모임 검색
│   └── [meetingId]/          # 동적 라우트 (Dynamic Route)
│       └── page.tsx          # 예: /meetings/1, /meetings/123 모두 이 페이지가 처리함
│
├── lessons/                      # 클래스
│   ├── page.tsx                  # 클래스 목록
│   ├── [lessonId]/
│   │   ├── page.tsx              # 클래스 상세
│   │   └── schedule/
│   │       └── page.tsx          # 일정 관리 (보호된 페이지)
│   └── manage/
│       └── page.tsx              # 클래스 대시보드 (보호된 페이지)
│
├── interests/
│   └── page.tsx                  # 관심사 선택
│
├── moimer-intro/
│   └── page.tsx                  # 모이머 소개
│
├── chats/
│   └── page.tsx                  # 채팅 (보호된 페이지)
│
├── payments/
│   └── preview/
│       └── page.tsx              # 결제 미리보기 (보호된 페이지)
│
└── mypage/                       # 마이페이지 (보호된 페이지)
    ├── layout.tsx                # 마이페이지 전용 레이아웃
    ├── page.tsx                  # 리다이렉트 → /mypage/profile
    ├── profile/
    │   └── page.tsx              # 프로필
    ├── class/
    │   ├── wish-list/
    │   │   └── page.tsx          # 찜 목록
    │   ├── points/
    │   │   └── page.tsx          # 포인트
    │   ├── coupons/
    │   │   └── page.tsx          # 쿠폰
    │   ├── orders/
    │   │   ├── page.tsx          # 주문 내역
    │   │   └── [enrollmentId]/
    │   │       └── cancel-info/
    │   │           └── page.tsx  # 취소 정보
    │   └── profit/
    │       └── page.tsx          # 강사 수익 (강사 전용)
    └── meetings/
        ├── join/
        │   └── page.tsx          # 참여한 모임
        ├── hosting/
        │   ├── page.tsx          # 주최한 모임
        │   └── [id]/
        │       └── participations/
        │           └── page.tsx  # 참가자 목록
```

### 🗂️ Next.js App Router 마이그레이션 매핑 가이드

| Next.js App Router 경로                              | 기존 Vite 페이지 컴포넌트 (src/pages/...) | 이관상태 |
| :--------------------------------------------------- | :---------------------------------------- | :------- |
| `layout.tsx`                                         | -                                         | ✅ 완료  |
| `page.tsx` (홈)                                      | `Home.tsx`                                | ✅ 완료  |
| **(auth) 그룹**                                      |                                           |          |
| `login/page.tsx`                                     | `user/Login.tsx`                          | ✅ 완료  |
| `join/page.tsx`                                      | `user/Join.tsx`                           | ✅ 완료  |
| `user-info/page.tsx`                                 | `user/UserInfo.tsx`                       | ✅ 완료  |
| `find-password/page.tsx`                             | `user/FindPassword.tsx`                   | ✅ 완료  |
| `reset-password/page.tsx`                            | `user/ResetPassword.tsx`                  | ✅ 완료  |
| `oauth/kakao/callback/page.tsx`                      | `user/KakaoCallback.tsx`                  | ✅ 완료  |
| **meetings (모임)**                                  |                                           |          |
| `meetings/page.tsx`                                  | `meetings/MeetingsPage.tsx`               | ✅ 완료  |
| `meetings/search/page.tsx`                           | `meetings/MeetingsSearchPage.tsx`         | ✅ 완료  |
| `meetings/[meetingId]/page.tsx`                      | `meetings/MeetingDetail.tsx`              | ✅ 완료  |
| **lessons (클래스)**                                 |                                           |          |
| `lessons/page.tsx`                                   | `class/LessonList.tsx`                    | ✅ 완료  |
| `lessons/[lessonId]/page.tsx`                        | `class/LessonDetail.tsx`                  | ✅ 완료  |
| `lessons/[lessonId]/schedule/page.tsx`               | `class/manage/ScheduleManagementPage.tsx` | ✅ 완료  |
| `lessons/manage/page.tsx`                            | `class/ClassDashboardPage.tsx`            | ✅ 완료  |
| **기타**                                             |                                           |          |
| `interests/page.tsx`                                 | `interests/Interests.tsx`                 | ✅ 완료  |
| `moimer-intro/page.tsx`                              | `moimer/MoimerIntro.tsx`                  | ✅ 완료  |
| `chats/page.tsx`                                     | `chat/Chatting.tsx`                       | ✅ 완료  |
| `payments/preview/page.tsx`                          | `pay/ClassPayment.tsx`                    | ✅ 완료  |
| **mypage (마이페이지)**                              |                                           |          |
| `mypage/layout.tsx`                                  | -                                         | ✅ 완료  |
| `mypage/profile/page.tsx`                            | `mypage/Profile.tsx`                      | ✅ 완료  |
| `mypage/class/wish-list/page.tsx`                    | `mypage/WishList.tsx`                     | ✅ 완료  |
| `mypage/class/points/page.tsx`                       | `mypage/Points.tsx`                       | ✅ 완료  |
| `mypage/class/coupons/page.tsx`                      | `mypage/Coupons.tsx`                      | ✅ 완료  |
| `mypage/class/orders/page.tsx`                       | `mypage/OrderList.tsx`                    | ✅ 완료  |
| `mypage/class/orders/[id]/cancel/page.tsx`           | `mypage/CancelClass.tsx`                  | ✅ 완료  |
| `mypage/class/profit/page.tsx`                       | `mypage/TeacherProfit.tsx`                | ✅ 완료  |
| `mypage/meetings/join/page.tsx`                      | `mypage/JoinedMeeting.tsx`                | ✅ 완료  |
| `mypage/meetings/hosting/page.tsx`                   | `mypage/HostMeeting.tsx`                  | ✅ 완료  |
| `mypage/meetings/hosting/[id]/participants/page.tsx` | `mypage/Participations.tsx`               | ✅ 완료  |

---

### 동적 라우팅 (Dynamic Routing) 이해하기

`[folderName]` 형식(대괄호로 감싼 폴더명)은 **변수**처럼 동작하는 동적 라우트입니다.

- **의미**: "이 위치에는 어떤 값이든 들어올 수 있다"는 뜻입니다.
- **예시**: `src/app/meetings/[meetingId]/page.tsx` 하나만 만들면 다음 URL들을 모두 처리합니다.
    - `/meetings/1`
    - `/meetings/100`
    - `/meetings/abc`
- **작동 방식**:
    - URL의 `1`, `100`, `abc` 등의 값이 `meetingId`라는 파라미터로 전달됩니다.
    - **서버 컴포넌트**: `props.params.meetingId`로 접근
    - **클라이언트 컴포넌트**: `useParams().meetingId`로 접근
- **결론**: ID마다 폴더를 따로 만들 필요가 **전혀 없습니다**. 단 하나의 `[meetingId]` 폴더만 있으면 됩니다.

---

### 📝 팀원들을 위한 마이그레이션 체크리스트

새로운 페이지를 만들거나 기존 코드를 수정할 때 이것만 기억하세요!

1.  **파일 위치 확인**:
    - UI와 비즈니스 로직은 `src/pages` 이하에 (Vite/Next 공통)
    - 마이그레이션 어댑터는 `src/app` 이하에 (Next 전용)
2.  **클라이언트 지시어**: `src/app` 내부에서 훅(useState, useEffect 등)을 사용하는 모든 파일 최상단에는 반드시 `'use client';`를 적어주세요.
3.  **절대 경로**: Next.js에서는 `@/`를 사용한 절대 경로 임포트를 권장합니다. (예: `import { Button } from '@/components/ui/button';`)
4.  **이미지 적용**: `<img>` 태그 대신 Next.js의 `<Image />` 컴포넌트 사용을 고려해보세요. (성능 최적화에 도움이 됩니다.)
5.  **404 확인**: 새로운 폴더를 만들었다면 `MypageSidebarNext.tsx`나 GNB의 링크 주소가 새로운 Next.js 경로와 일치하는지 꼭 확인하세요!

---

### 하이브리드 전략: Option 1 (Props 주입 방식)

우리의 목표는 **Vite(기존)와 Next.js(신규)가 하나의 코드를 함께 사용**하는 것입니다. 이를 위해 "Props 주입" 방식을 사용합니다.

이 방식은 쉽게 말해 **"버튼이나 데이터는 컴포넌트가 가지고 있되, '어디로 가야 할지'나 'ID값'은 부모가 알려주는 것"**입니다.

#### 🛠️ 구현 3단계

**1단계: 공통 비즈니스 로직과 UI를 `Content` 컴포넌트로 분리하기**
기존 `src/pages`에 있는 파일에서 `useNavigate`나 `useParams` 같이 특정 플랫폼에 종속된 훅을 제거하고, 이를 **Props(인자)**로 받도록 바꿉니다.

```tsx
// src/pages/example/ExampleContent.tsx (공통 UI)
interface ExampleContentProps {
	id: string; // useParams 대신 받음
	onNavigate: (url: string) => void; // useNavigate 대신 받음
}

export const ExampleContent = ({ id, onNavigate }: ExampleContentProps) => {
	return (
		<div>
			<h1>ID: {id} 상세 페이지</h1>
			<button onClick={() => onNavigate('/next-step')}>다음으로</button>
		</div>
	);
};
```

**2단계: Vite에서 사용하기 (기존 앱 유지)**
Vite는 `react-router-dom`의 기능을 주입해줍니다.

```tsx
// src/pages/example/ExamplePage.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { ExampleContent } from './ExampleContent';

const ExamplePage = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	// Vite의 기능을 Content에 주입!
	return <ExampleContent id={id!} onNavigate={(url) => navigate(url)} />;
};
```

**3단계: Next.js에서 사용하기 (신규 앱 적용)**
Next.js는 `next/navigation`의 기능을 주입해줍니다.

```tsx
// src/app/example/[id]/ExampleClient.tsx
'use client';
import { useRouter, useParams } from 'next/navigation';
import { ExampleContent } from '@/pages/example/ExampleContent';

export default function ExampleClient() {
	const router = useRouter();
	const params = useParams();

	// Next.js의 기능을 똑같은 Content에 주입!
	return <ExampleContent id={params.id as string} onNavigate={(url) => router.push(url)} />;
}
```

---

### React Router ➡️ Next.js 주요 변경 사항 (요약)

| 기능          | ❌ React Router (Vite)            | ✅ Next.js (App Router)       |
| :------------ | :-------------------------------- | :---------------------------- |
| **이동하기**  | `const navigate = useNavigate();` | `const router = useRouter();` |
| **이동 코드** | `navigate('/path');`              | `router.push('/path');`       |
| **파라미터**  | `const { id } = useParams();`     | `const params = useParams();` |
| **링크**      | `<Link to="...">`                 | `<Link href="...">`           |
| **훅 패키지** | `from 'react-router-dom'`         | `from 'next/navigation'`      |
