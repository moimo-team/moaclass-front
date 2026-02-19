# SEO 실행 가이드 (MoaClass, Next.js App Router)

이 문서는 MoaClass 프론트엔드(`src/app`) 기준 SEO 작업을 **즉시 실행 가능**한 형태로 정리한 운영 가이드입니다.

- 기준 도메인: `https://www.moaclass.com`
- 범위: 1순위~3순위 통합
- 독자: SEO 담당자 + 프론트엔드 개발자

---

## 1. 개요: 목표와 우선순위

### 목표

1. 검색 엔진 크롤링/인덱싱 효율 개선
2. 동적 페이지 메타데이터 정확도 개선
3. 소셜 공유 미리보기 품질 개선
4. 성능 지표(LCP/CLS/INP) 개선
5. 문서 가이드와 실제 코드 상태 동기화

### 우선순위

1. 크롤링 제어 + 인덱싱 정책 확립 (`robots`, `sitemap`, `generateMetadata`, `noindex`) + 시맨틱 태그
2. 구조화 데이터(JSON-LD) + Canonical + Open Graph(수동/동적) 운영 기준 정립
3. 이미지/폰트/스크립트/코드 스플리팅 성능 최적화

---

## 2. 현재 프로젝트 기준 경로/전제

이 섹션은 3~12번 적용의 기준점을 정리합니다. SEO 관점에서 중요한 경로만 분류해 현재 구현 상태와 함께 관리합니다.

### 2.1 공개 인덱싱 대상 (SEO 핵심 경로)

검색 결과 노출을 목표로 하는 공개 페이지 기준입니다.

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/lessons/page.tsx`
- `src/app/lessons/[lessonId]/page.tsx`
- `src/app/meetings/page.tsx`
- `src/app/meetings/search/page.tsx`
- `src/app/meetings/[meetingId]/page.tsx`
- `src/app/moimer-intro/page.tsx`
- `src/app/interests/page.tsx`

### 2.2 인덱싱 제외 대상 (비공개/인증/운영 경로)

로그인 후 전용 화면, 개인화 화면, 운영 화면은 기본적으로 인덱싱 제외 대상으로 봅니다.

- `src/app/chats/page.tsx`
- `src/app/payments/preview/page.tsx`
- `src/app/lessons/manage/page.tsx`
- `src/app/lessons/[lessonId]/schedule/page.tsx`
- `src/app/(auth)/**`
- `src/app/mypage/**`

### 2.3 SEO 유틸/데이터 소스

메타데이터 조립과 동적 SEO 데이터 조회 시 참조하는 소스입니다.

- `src/utils/metadata.ts`
- `src/api/lesson.api.ts` (`fetchLesson`)
- `src/api/meeting.api.ts` (`getMeetingById`)

### 2.4 현재 구현 상태 전제

- `src/utils/metadata.ts`는 공통 조립 유틸이며 현재 파라미터는 `title`/`description`/`image`만 지원합니다.
- `metadataBase`는 아직 `src/app/layout.tsx`에 설정되어 있지 않습니다.
- `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`는 아직 없습니다(3번 섹션 생성 대상).
- `src/app/lessons/[lessonId]/page.tsx`는 `generateMetadata`가 있으나 임시 문자열 기반이고 `await params`를 사용 중입니다.
- `src/app/meetings/[meetingId]/page.tsx`는 `generateMetadata`가 아직 구현되지 않았습니다.

### 2.5 소스 오브 트루스 규칙

- Next SEO 기준 라우팅 소스는 `src/app/**/page.tsx`입니다.
- `src/routes/routeList.tsx`는 레거시 React Router 참조용으로만 취급하며, Next SEO 구현 기준으로 사용하지 않습니다.

### 2.6 도메인/URL 기준

- 기준 도메인: `https://www.moaclass.com`
- canonical/OG/JSON-LD 예시는 절대 URL 기준으로 문서화합니다.

### 2.7 이 섹션의 역할

- 이후 3~12번 섹션 적용 시 어떤 파일을 기준으로 작업할지 선언합니다.
- 현재 미구현 항목(파일 기반 메타데이터, 일부 동적 메타데이터)을 분리해 추적합니다.
- 우선순위 1~3 실행 시 대상 경로를 빠르게 도출할 수 있도록 기준을 고정합니다.

---

## 3. 1순위: 파일 기반 메타데이터

Next.js는 `src/app`에 약속된 파일을 두면 자동으로 SEO 파일을 생성합니다.

### 3.1 `src/app/robots.ts`

#### 역할

- 크롤러 접근 허용/차단 규칙 정의
- 사이트맵 위치 전달

#### 현재 상태 (프로젝트 기준)

- `src/app/robots.ts` 파일이 아직 없음
- 1순위 작업으로 생성 필요

#### 권장 규칙 (MoaClass, App Router 기준)

- 기본 허용: `/`
- 기본 차단(비공개/인증/운영): `/mypage`, `/chats`, `/payments`, `/lessons/manage`, `/lessons/*/schedule`
- 인증 관련 차단 권장: `/login`, `/join`, `/find-password`, `/reset-password`, `/oauth/kakao/callback`, `/user-info`
- 주의: SEO 라우트 기준은 `src/app/**/page.tsx`이며 `src/routes/routeList.tsx`는 레거시 참조로만 사용

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [
				'/mypage/',
				'/chats/',
				'/payments/',
				'/lessons/manage/',
				'/lessons/*/schedule',
				'/oauth/kakao/callback',
				'/user-info',
				'/login',
				'/join',
				'/find-password',
				'/reset-password',
			],
		},
		sitemap: 'https://www.moaclass.com/sitemap.xml',
	};
}
```

#### 확인 URL

- `https://www.moaclass.com/robots.txt`

### 3.2 `src/app/sitemap.ts`

#### 역할

- 정적 + 동적 URL 목록 제공
- `lastModified`로 갱신 신호 전달

#### 현재 상태 (프로젝트 기준)

- `src/app/sitemap.ts` 파일이 아직 없음
- 1순위 작업으로 생성 필요

#### 권장 규칙 (MoaClass, App Router 기준)

- 정적 라우트(공개 페이지): `/`, `/lessons`, `/meetings`, `/meetings/search`, `/moimer-intro`, `/interests`
- 동적 라우트(공개 상세): `/lessons/[lessonId]`, `/meetings/[meetingId]`
- 제외 라우트(비공개/인증/운영): `/mypage/**`, `/chats`, `/payments/**`, `/lessons/manage`, `/lessons/[lessonId]/schedule`, `/(auth)/**`

```ts
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.moaclass.com';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://moaclass-back.vercel.app';

type ListResponse<T> = {
	data: T[];
	meta?: { page: number; totalPages: number; limit: number; totalCount: number };
};

type LessonItem = { id: number; createdAt: string; updatedAt?: string };
type MeetingItem = { meetingId: number; meetingDate?: string };

async function fetchAllPages<T>(path: string, limit = 100): Promise<T[]> {
	let page = 1;
	let totalPages = 1;
	const items: T[] = [];

	while (page <= totalPages) {
		const res = await fetch(`${API_BASE}${path}?page=${page}&limit=${limit}`, {
			// sitemap은 매 요청마다 새로 만들 필요가 없으므로 재검증 주기 권장
			next: { revalidate: 3600 },
		});

		if (!res.ok) break;
		const json = (await res.json()) as ListResponse<T>;
		items.push(...(json.data ?? []));

		totalPages = json.meta?.totalPages ?? 1;
		page += 1;
	}

	return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticRoutes: MetadataRoute.Sitemap = [
		'',
		'/lessons',
		'/meetings',
		'/meetings/search',
		'/moimer-intro',
		'/interests',
	].map((route) => ({
		url: `${BASE_URL}${route}`,
		lastModified: new Date(),
		changeFrequency: route === '' ? 'daily' : 'weekly',
		priority: route === '' ? 1 : 0.8,
	}));

	const [lessons, meetings] = await Promise.all([
		fetchAllPages<LessonItem>('/lessons'),
		fetchAllPages<MeetingItem>('/meetings'),
	]);

	const lessonRoutes: MetadataRoute.Sitemap = lessons.map((lesson) => ({
		url: `${BASE_URL}/lessons/${lesson.id}`,
		lastModified: new Date(lesson.updatedAt ?? lesson.createdAt),
		changeFrequency: 'weekly',
		priority: 0.7,
	}));

	const meetingRoutes: MetadataRoute.Sitemap = meetings.map((meeting) => ({
		url: `${BASE_URL}/meetings/${meeting.meetingId}`,
		lastModified: new Date(meeting.meetingDate ?? Date.now()),
		changeFrequency: 'weekly',
		priority: 0.6,
	}));

	return [...staticRoutes, ...lessonRoutes, ...meetingRoutes];
}
```

#### 확인 URL

- `https://www.moaclass.com/sitemap.xml`

### 3.3 `src/app/lessons/[lessonId]/opengraph-image.tsx`

#### 역할

- 레슨별 OG 이미지를 동적으로 생성
- 공유 카드 클릭률 개선

#### 현재 상태 (프로젝트 기준)

- `src/app/lessons/[lessonId]/opengraph-image.tsx` 파일이 아직 없음
- 1순위 작업으로 생성 필요

```tsx
import { ImageResponse } from 'next/og';
import { fetchLesson } from '@/api/lesson.api';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png'; // 크롤러 호환성을 위해 png로 설정

export default async function Image({ params }: { params: { lessonId: string } }) {
	const lesson = await fetchLesson(Number(params.lessonId));

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: '#111',
				color: '#fff',
				padding: 48,
				fontSize: 56,
				fontWeight: 700,
				textAlign: 'center',
			}}
		>
			{lesson?.title ?? '모아클래스'}
		</div>,
		size,
	);
}
```

### 3.4 `favicon` / `icon` 위치 전략

#### 역할

- 브라우저 탭 아이콘 제공

#### 현재 상태 (프로젝트 기준)

- 아이콘 파일은 `public/moaclass-icon.svg`에 존재
- `src/app/layout.tsx`의 `metadata.icons.icon`에서 `'/moaclass-icon.svg'`로 참조 중
- 이 방식은 정상 동작하며 당장 변경 필수는 아님

#### 권장 위치

- 운영 안정성과 브라우저 호환성을 함께 보려면 `src/app/favicon.ico` 추가를 권장
- SVG 아이콘(`public/moaclass-icon.svg`)은 `metadata.icons` 보조 아이콘으로 병행 가능

#### 정리

- 빠르게 유지: 현재처럼 `public` + `metadata.icons` 참조 유지
- 표준화/일관성 우선: `src/app/favicon.ico`를 추가해 관례 파일로 관리
- 동적 브랜딩이 필요할 때만 `src/app/icon.tsx` 사용

#### 권장 적용 순서

1. 현재 `public/moaclass-icon.svg` + `metadata.icons`는 유지
2. `src/app/favicon.ico`를 추가해 기본 파비콘을 명시
3. 필요 시 `src/app/icon.tsx`를 추가해 동적 아이콘 확장

---

## 4. 1순위: 동적 메타데이터 (`generateMetadata`)

### 핵심 원칙

- `src/utils/metadata.ts`는 **메타데이터 조립 유틸**이며, 동적 데이터 조회 실행 위치가 아닙니다.
- 동적 SEO는 반드시 `src/app/**/page.tsx`의 `generateMetadata`에서 처리합니다.
- 현재 `createPageMetadata`는 `title`/`description`/`image`만 지원하므로, canonical/robots는 페이지에서 직접 병합합니다.

### 4.1 현재 코드 상태 체크 (프로젝트 기준)

#### 이미 메타데이터가 적용된 페이지

- `src/app/page.tsx` (홈)
- `src/app/interests/page.tsx`, `src/app/moimer-intro/page.tsx` (공개 정적 페이지)
- `src/app/chats/page.tsx`, `src/app/payments/preview/page.tsx`, `src/app/lessons/manage/page.tsx`, `src/app/lessons/[lessonId]/schedule/page.tsx` (noindex 성격)

#### 보강이 필요한 페이지

1. `src/app/lessons/[lessonId]/page.tsx`

- `generateMetadata`는 존재하지만 현재 임시 문자열 기반
- 실데이터(`fetchLesson`) + canonical + 오류 fallback(`noindex`) 필요

2. `src/app/meetings/[meetingId]/page.tsx`

- `generateMetadata` 미구현
- `getMeetingById` 기반 동적 메타데이터 신규 추가 필요

3. `src/app/lessons/page.tsx`, `src/app/meetings/page.tsx`, `src/app/meetings/search/page.tsx`

- 메타데이터 안내 주석만 있고 실제 `metadata` export 미적용

### 4.2 구현 시 주의사항 (현재 코드베이스 기준)

1. `params` 타입/사용 방식은 파일마다 혼재되어 있으므로 한 패턴으로 통일하는 것을 권장

- 객체 패턴: `params: { lessonId: string }` 후 `Number(params.lessonId)`
- Promise 패턴: `params: Promise<{ lessonId: string }>` 후 `const { lessonId } = await params`
- 핵심은 **같은 파일에서 타입과 사용 방식 일치**입니다.

2. `generateMetadata`는 서버 실행 컨텍스트

- `window`, `localStorage`, 클라이언트 스토어 접근 금지

3. 데이터 조회 경로

- 인증 의존 로직은 피하고, SEO에 필요한 최소 데이터만 조회
- 실패/없는 ID는 `robots: { index: false, follow: false }`로 처리

### 4.3 `lessons/[lessonId]` 구현 흐름

1. `lessonId` 파싱
2. `fetchLesson` 호출
3. `createPageMetadata` 조립
4. `alternates.canonical` 병합
5. 실패 시 fallback title/description + `noindex`

```tsx
import type { Metadata } from 'next';
import { fetchLesson } from '@/api/lesson.api';
import { createPageMetadata } from '@/utils/metadata';

type Props = {
	params: { lessonId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const lessonId = Number(params.lessonId);

	if (!Number.isFinite(lessonId)) {
		return {
			...createPageMetadata({
				title: '클래스를 찾을 수 없습니다',
				description: '유효하지 않은 클래스 경로입니다.',
			}),
			robots: { index: false, follow: false },
		};
	}

	try {
		const lesson = await fetchLesson(lessonId);

		return {
			...createPageMetadata({
				title: lesson.title,
				description: lesson.description,
				image: lesson.representativeImage,
			}),
			alternates: {
				canonical: `https://www.moaclass.com/lessons/${lessonId}`,
			},
		};
	} catch {
		return {
			...createPageMetadata({
				title: '클래스를 찾을 수 없습니다',
				description: '요청한 클래스를 찾지 못했습니다.',
			}),
			robots: { index: false, follow: false },
		};
	}
}
```

### 4.4 `meetings/[meetingId]` 구현 흐름

1. `meetingId` 파싱
2. `getMeetingById` 호출
3. `createPageMetadata` 조립
4. `alternates.canonical` 병합
5. 실패 시 fallback + `noindex`

```tsx
import type { Metadata } from 'next';
import { getMeetingById } from '@/api/meeting.api';
import { createPageMetadata } from '@/utils/metadata';

type Props = {
	params: { meetingId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const meetingId = Number(params.meetingId);

	if (!Number.isFinite(meetingId)) {
		return {
			...createPageMetadata({
				title: '모임을 찾을 수 없습니다',
				description: '유효하지 않은 모임 경로입니다.',
			}),
			robots: { index: false, follow: false },
		};
	}

	try {
		const meeting = await getMeetingById(meetingId);

		return {
			...createPageMetadata({
				title: meeting.title,
				description: meeting.description,
				image: meeting.meetingImage,
			}),
			alternates: {
				canonical: `https://www.moaclass.com/meetings/${meetingId}`,
			},
		};
	} catch {
		return {
			...createPageMetadata({
				title: '모임을 찾을 수 없습니다',
				description: '요청한 모임을 찾지 못했습니다.',
			}),
			robots: { index: false, follow: false },
		};
	}
}
```

### 4.5 정적 metadata 보강 템플릿 (목록 페이지)

```tsx
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '모임 목록',
	description: '모아클래스에서 원하는 모임을 찾아보세요.',
});
```

적용 대상:

- `src/app/lessons/page.tsx`
- `src/app/meetings/page.tsx`
- `src/app/meetings/search/page.tsx`

### 4.6 이 섹션의 완료 기준

- `lessons/[lessonId]`, `meetings/[meetingId]`에 동적 `generateMetadata` 적용
- 목록 페이지 3곳에 정적 `metadata` export 적용
- 잘못된 경로/조회 실패 시 `noindex` fallback 동작
- canonical이 상세 URL 기준으로 설정됨

---

## 5. 1순위: 시맨틱 태그

이 섹션은 “지금 코드에서 어디를 바꿔야 하는지”에 집중합니다. 권장 태그 자체보다 실제 적용 위치와 우선순위를 기준으로 정리합니다.

### 5.1 SEO/접근성 기준 핵심 태그와 실제 매핑

| 태그                    | 핵심 용도                    | 현재/수정 대상 파일                                                 |
| ----------------------- | ---------------------------- | ------------------------------------------------------------------- |
| `header`                | 페이지 머리말                | `src/components/common/next/HeaderNext.tsx` (루트 `div` → `header`) |
| `nav`                   | 메뉴 링크 그룹               | `src/components/common/next/HeaderNext.tsx` 내부 메뉴 그룹          |
| `main`                  | 페이지 핵심 본문(문서당 1개) | `src/app/layout.tsx` (이미 적용)                                    |
| `footer`                | 꼬리말/저작권 링크           | `src/components/common/Footer.tsx` (루트 `div` → `footer`)          |
| `article`               | 독립 콘텐츠 단위             | `src/pages/class/LessonDetail.tsx`의 `LessonDetailContent` 루트     |
| `section`               | 주제별 콘텐츠 구획           | `src/components/features/lessons/LessonTabContent.tsx` (이미 적용)  |
| `aside`                 | 보조 정보 영역               | `LessonDetailContent`의 예약/결제 사이드바 영역                     |
| `h1`                    | 페이지 대표 제목(1개 권장)   | `LessonHeader.tsx`(정상), `ClassDashboardPage.tsx`(중복 수정 필요)  |
| `figure` + `figcaption` | 이미지 + 설명 묶음           | `src/components/features/lessons/LessonGallery.tsx` 보강 대상       |
| `time`                  | 날짜/시간 의미 전달          | `src/app/meetings/[meetingId]/MeetingDetailClient.tsx` 보강 대상    |

### 5.2 현재 코드 기준 우선 수정 목록

1. `src/components/common/next/HeaderNext.tsx`

- 루트 `div`를 `header`로 변경
- 메뉴 링크 그룹을 `nav`로 명시

2. `src/components/common/Footer.tsx`

- 루트 `div`를 `footer`로 변경

3. `src/pages/class/LessonDetail.tsx`

- `LessonDetailContent` 루트를 `article`로 명시
- `LessonReservationSidebar` 영역을 `aside`로 감싸 의미 분리

4. `src/pages/class/ClassDashboardPage.tsx`

- `h1` 2개를 1개로 정리
- 나머지 제목은 `h2` 또는 일반 텍스트로 조정

5. `src/components/features/lessons/LessonGallery.tsx`

- 대표 이미지 영역에 `figure` + `figcaption` 보강

6. `src/app/meetings/[meetingId]/MeetingDetailClient.tsx`

- 모임 일시 노출 텍스트를 `time dateTime="..."`로 보강

### 5.3 적용 예시 (프로젝트 기준)

#### 예시 1) Header / Footer

```tsx
// HeaderNext.tsx
<header className="w-full h-[80px] ...">
	<nav className="flex items-center w-full h-full max-w-7xl mx-auto ...">
		{/* 로고 + 메뉴 */}
	</nav>
</header>

// Footer.tsx
<footer className="w-full py-8 ...">
	{/* 저작권/링크 */}
</footer>
```

#### 예시 2) LessonDetailContent 루트 구조

```tsx
<article className="flex flex-col min-h-screen bg-background pt-12">
	<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
		<div className="md:col-span-2 space-y-8">{/* 본문 섹션 */}</div>
		<aside>{/* LessonReservationSidebar */}</aside>
	</div>
</article>
```

#### 예시 3) 모임 일시 `time` 마크업

```tsx
<time dateTime={meetingDetail.meetingDate}>{formatFullDateTime(meetingDetail.meetingDate)}</time>
```

### 5.4 체크 포인트

- 페이지당 `main` 1개 (`layout.tsx` 기준)
- 페이지당 대표 `h1` 1개 원칙 준수
- `section`에는 제목(`h2~h6`)이 포함되도록 유지
- 날짜/시간 표시에는 `time` 사용
- 대표 이미지 설명이 필요하면 `figure` + `figcaption` 사용

---

## 6. 2순위: 구조화 데이터 (JSON-LD)

구조화 데이터는 검색엔진이 페이지 의미를 정확히 이해하도록 돕는 보조 신호입니다. 이 프로젝트에서는 상세 페이지 2곳을 우선 적용 대상으로 둡니다.

### 6.1 현재 상태 (프로젝트 기준)

- 현재 `src/app` 경로에서 JSON-LD(`application/ld+json`)가 실제로 삽입된 페이지는 없음
- 1차 적용 우선순위:
    1. `src/app/lessons/[lessonId]/page.tsx` (`Course`)
    2. `src/app/meetings/[meetingId]/page.tsx` (`Event`)
- 목록 페이지(`lessons`, `meetings`)의 `ItemList`는 데이터/페이징 정책이 안정화된 뒤 선택 적용

### 6.2 삽입 위치 (현재 구조 기준)

- 위치: 각 상세 페이지의 **서버 page 컴포넌트** 반환부
- 순서 권장:
    1. ID 파싱
    2. 상세 데이터 조회
    3. JSON-LD 객체 생성
    4. `<script type="application/ld+json" ... />` 삽입
    5. 클라이언트 컴포넌트 렌더

```tsx
return (
	<>
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
		<LessonClient lessonId={lessonId} />
	</>
);
```

### 6.3 레슨 상세 JSON-LD (`Course`) 템플릿

```tsx
const courseJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Course',
	name: lesson.title,
	description: lesson.description,
	image: lesson.representativeImage ? [lesson.representativeImage] : undefined,
	provider: {
		'@type': 'Organization',
		name: '모아클래스',
		sameAs: 'https://www.moaclass.com',
	},
	offers: {
		'@type': 'Offer',
		price: String(lesson.discountedPrice ?? lesson.price),
		priceCurrency: 'KRW',
		availability: 'https://schema.org/InStock',
		url: `https://www.moaclass.com/lessons/${lesson.id}`,
	},
	aggregateRating:
		typeof lesson.rate === 'number' && Array.isArray(lesson.reviews)
			? {
					'@type': 'AggregateRating',
					ratingValue: String(lesson.rate),
					reviewCount: String(lesson.reviews.length),
				}
			: undefined,
};
```

### 6.4 모임 상세 JSON-LD (`Event`) 템플릿

```tsx
const eventJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Event',
	name: meeting.title,
	description: meeting.description,
	image: meeting.meetingImage ? [meeting.meetingImage] : undefined,
	startDate: meeting.meetingDate,
	eventStatus: 'https://schema.org/EventScheduled',
	eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
	location: {
		'@type': 'Place',
		name: meeting.location.address,
		address: meeting.location.address,
	},
	organizer: {
		'@type': 'Person',
		name: meeting.host.nickname,
	},
	url: `https://www.moaclass.com/meetings/${meeting.meetingId}`,
};
```

### 6.5 목록 페이지 `ItemList` (선택 적용)

아래 조건을 만족할 때만 적용:

- 목록 카드 데이터가 서버 기준으로 안정적으로 동일하게 렌더됨
- 페이지네이션/필터 URL 정책(canonical)이 먼저 정리됨

```tsx
const itemListJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'ItemList',
	itemListElement: lessons.map((lesson, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		url: `https://www.moaclass.com/lessons/${lesson.id}`,
		name: lesson.title,
	})),
};
```

### 6.6 구현/검증 체크리스트

- [ ] 레슨 상세(`Course`) JSON-LD 적용
- [ ] 모임 상세(`Event`) JSON-LD 적용
- [ ] 값이 비어 있으면 해당 속성 자체를 제거(빈 문자열/더미값 금지)
- [ ] 화면에 실제 노출되는 데이터와 JSON-LD 값 일치
- [ ] 배포 URL로 Rich Results Test 검증

검증 도구:

1. Google Rich Results Test: `https://search.google.com/test/rich-results`
2. Schema Validator: `https://validator.schema.org`

---

## 7. 2순위: Canonical URL

canonical은 중복 URL로 분산되는 SEO 신호를 한 URL로 모으는 기본 설정입니다. 현재 프로젝트는 필터/정렬/검색 쿼리가 많아 2순위 필수 작업으로 관리합니다.

### 7.1 현재 상태 (프로젝트 기준)

- `src/app/layout.tsx`에 `metadataBase`가 아직 없음
- canonical이 실제로 적용된 주요 공개 페이지가 거의 없음
- 특히 아래 페이지는 우선 보강 대상:
    - `src/app/page.tsx`
    - `src/app/lessons/page.tsx`
    - `src/app/meetings/page.tsx`
    - `src/app/meetings/search/page.tsx`
    - `src/app/lessons/[lessonId]/page.tsx`
    - `src/app/meetings/[meetingId]/page.tsx`

### 7.2 canonical 정책 (MoaClass)

1. 목록 페이지

- canonical은 기본 path로 고정 (`/lessons`, `/meetings`, `/meetings/search`)
- 필터/정렬/검색 쿼리는 canonical에서 제거

2. 상세 페이지

- canonical은 path param만 포함 (`/lessons/{id}`, `/meetings/{id}`)
- `utm_*`, `fbclid`, `gclid` 등 추적 파라미터는 제거

3. 오류/없는 상세 페이지

- canonical보다 `robots: noindex`를 우선 적용

### 7.3 전역 기준 설정 (`layout.tsx`)

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
	metadataBase: new URL('https://www.moaclass.com'),
	title: '모아클 | MOACLASS',
	description: '모아클 - 모여라 아! 이거다 싶은 클래스',
};
```

### 7.4 목록 페이지 canonical 템플릿

```tsx
import type { Metadata } from 'next';
import { createPageMetadata } from '@/utils/metadata';

export const metadata: Metadata = {
	...createPageMetadata({
		title: '클래스 목록',
		description: '모아클래스에서 원하는 클래스를 찾아보세요.',
	}),
	alternates: {
		canonical: '/lessons',
	},
};
```

적용 대상:

- `src/app/page.tsx` (`canonical: '/'`)
- `src/app/lessons/page.tsx`
- `src/app/meetings/page.tsx`
- `src/app/meetings/search/page.tsx`

### 7.5 상세 페이지 canonical 템플릿

```tsx
import type { Metadata } from 'next';
import { createPageMetadata } from '@/utils/metadata';

type Props = { params: { lessonId: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const lessonId = Number(params.lessonId);

	if (!Number.isFinite(lessonId)) {
		return {
			...createPageMetadata({
				title: '클래스를 찾을 수 없습니다',
				description: '유효하지 않은 클래스 경로입니다.',
			}),
			robots: { index: false, follow: false },
		};
	}

	return {
		...createPageMetadata({
			title: `클래스 상세 ${lessonId}`,
			description: `클래스 상세 ${lessonId}`,
		}),
		alternates: {
			canonical: `/lessons/${lessonId}`,
		},
	};
}
```

모임 상세도 동일하게 `meetingId` 기준 canonical을 `/meetings/{id}`로 설정합니다.

### 7.6 쿼리 파라미터 처리 기준

- canonical에서 제거:
    - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
    - `fbclid`, `gclid`
- 전략 검토 대상:
    - `page`, `sort`, `category`, `keyword`
- 인덱싱 전략이 없으면 목록 기본 canonical로 통일

### 7.7 구현/검증 체크리스트

- [ ] `layout.tsx`에 `metadataBase` 적용
- [ ] 홈/목록/검색/상세 페이지 canonical 적용
- [ ] 상세 ID 오류 시 `noindex` fallback 동작
- [ ] 배포 후 `<link rel="canonical" ...>` 실제 출력 확인

---

## 8. 2순위: Open Graph(수동)

Open Graph는 카카오톡/슬랙/디스코드 공유 카드 품질을 직접 좌우합니다. 이 프로젝트는 “상세는 동적 OG, 정적/목록은 수동 OG”로 분리 운영하는 것이 가장 효율적입니다.

### 8.1 현재 상태 (프로젝트 기준)

- `src/app/layout.tsx`에는 전역 fallback OG가 있음
- `src/app/lessons/[lessonId]/opengraph-image.tsx`는 아직 없음
- `src/app/page.tsx`, `src/app/lessons/page.tsx`, `src/app/meetings/page.tsx`, `src/app/meetings/search/page.tsx`는 수동 OG 보강 필요
- `src/app/interests/page.tsx`, `src/app/moimer-intro/page.tsx`도 수동 OG 보강 대상

### 8.2 운영 기준

1. 레슨 상세(`/lessons/[lessonId]`)

- 우선 전략: `opengraph-image.tsx` 기반 동적 OG
- 이유: 레슨별 제목/가격/대표이미지 변동이 큼

2. 정적/목록/검색 페이지

- 우선 전략: `metadata.openGraph` 수동 설정
- 이유: 페이지 성격이 고정되어 동일 이미지/문구를 재사용 가능

### 8.3 수동 OG 최소 필수값

- `openGraph.title`
- `openGraph.description`
- `openGraph.images`

```tsx
openGraph: {
	title: '클래스 목록 | 모아클래스',
	description: '모아클래스에서 다양한 클래스를 찾아보세요.',
	images: [
		{
			url: 'https://www.moaclass.com/og-default.png',
			width: 1200,
			height: 630,
			alt: '모아클래스 기본 공유 이미지',
		},
	],
}
```

### 8.4 전역 fallback OG (`layout.tsx`) 권장안

```tsx
export const metadata = {
	openGraph: {
		type: 'website',
		siteName: '모아클래스',
		title: '모아클래스',
		description: '모아클래스 - 모여라! 이거다 싶은 클래스',
		images: [
			{
				url: 'https://www.moaclass.com/og-default.png',
				width: 1200,
				height: 630,
				alt: '모아클래스 기본 공유 이미지',
			},
		],
	},
};
```

### 8.5 상세 페이지 동적 OG 템플릿 (추가 예정)

```tsx
// src/app/lessons/[lessonId]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { fetchLesson } from '@/api/lesson.api';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { lessonId: string } }) {
	const lesson = await fetchLesson(Number(params.lessonId));

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{lesson?.title ?? '모아클래스'}
		</div>,
		size,
	);
}
```

### 8.6 적용/검증 체크리스트

- [ ] `layout.tsx` fallback OG 이미지가 아이콘 SVG가 아닌 전용 OG 이미지로 설정됨
- [ ] 홈/목록/검색 페이지 수동 OG 적용
- [ ] `src/app/lessons/[lessonId]/opengraph-image.tsx` 생성
- [ ] 카카오톡/슬랙에서 실제 공유 미리보기 확인
- [ ] OG 이미지는 1200x630, 절대 URL 기준 유지

---

## 9. 3순위: 이미지 최적화

이미지 최적화는 LCP/CLS 개선에 직접 영향이 있습니다. 이 프로젝트는 `<img>` 사용 비중이 높아 점진적 전환 전략이 적합합니다.

### 9.1 현재 상태 (프로젝트 기준)

- `src/components` 전반에 `<img>` 사용이 다수 존재
- `next/image` 적용은 거의 없음
- `next.config.ts`는 이미 `images.domains`로 외부 이미지 도메인을 허용 중

### 9.2 우선 전환 대상

1. `src/components/features/lessons/LessonCard.tsx`

- 카드 대표 이미지 + 모임장 프로필 이미지 포함

2. `src/components/features/lessons/LessonGallery.tsx`

- 상세 상단 메인 이미지(가시영역 비중 큼)

3. `src/components/features/topics/TopicCard.tsx`

- 원형 썸네일 다수 렌더링

4. `src/components/features/home/Review.tsx`

- 홈 상단 섹션 배치 시 LCP 후보가 될 가능성 높음

### 9.3 전환 원칙

- `<img>` → `next/image`
- 반응형 썸네일/배너: `fill + sizes`
- 고정 크기 아이콘/아바타: `width`/`height` 명시
- LCP 후보 이미지에만 `priority` 적용

### 9.4 LCP 이미지 적용 가이드

LCP(Largest Contentful Paint)는 첫 화면에서 가장 큰 콘텐츠가 보이는 시점입니다. 보통 상단 대표 이미지(배너/메인 썸네일)가 대상입니다.

```tsx
import Image from 'next/image';

// LCP 후보 (첫 화면 핵심 이미지)
<Image src={heroImage} alt="메인 배너" fill sizes="100vw" priority className="object-cover" />;
```

```tsx
import Image from 'next/image';

// 카드형 대표 이미지
<Image
	src={lesson.representativeImage || defaultLessonImage}
	alt={lesson.title}
	fill
	sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
	className="object-cover"
/>;
```

```tsx
import Image from 'next/image';

// 작은 프로필 이미지(고정 크기)
<Image
	src={lesson.teacher.image || defaultProfileImage}
	alt={lesson.teacher.nickname || '모임장'}
	width={20}
	height={20}
	className="rounded-full object-cover"
/>;
```

### 9.5 `next.config.ts` 설정 병행

현재 프로젝트는 `images.domains`를 사용 중이며, 이 방식을 유지해도 무방합니다.

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['localhost', 'moaclass-back.vercel.app', 'moaclass-back.onrender.com'],
	},
};

export default nextConfig;
```

필요 시 세부 제어가 필요할 때만 `remotePatterns`로 확장합니다.

### 9.6 구현/검증 체크리스트

- [ ] `LessonCard`, `LessonGallery`, `TopicCard`의 핵심 `<img>`를 `next/image`로 전환
- [ ] LCP 후보 이미지에만 `priority` 적용
- [ ] 모든 이미지에 의미 있는 `alt` 텍스트 제공
- [ ] 적용 후 Lighthouse/Web Vitals에서 LCP 요소와 CLS 개선 여부 확인

---

## 10. 3순위: 폰트 최적화

폰트 로딩 방식은 CLS/FOUT에 직접 영향을 줍니다. 현재 프로젝트는 폰트 선언 경로가 혼재되어 있어 우선 “단일 소스화”가 필요합니다.

### 10.1 현재 상태 (프로젝트 기준)

- `src/app/layout.tsx`에서 외부 링크(`nanum-square.css`)로 폰트를 로딩 중
- `src/index.css`에서
    - `@theme`의 `--font-sans`는 `Pretendard` 기반
    - `body`는 `font-family: "NanumSquare", sans-serif;`를 직접 지정
- 즉, 테마 폰트와 body 직접 지정이 혼재된 상태
- `src/app/fonts` 폴더(로컬 폰트 파일)는 아직 없음

### 10.2 정리 방향

1. 단기(현재 구조 유지)

- `src/index.css`에서 body 직접 `font-family` 지정 제거
- `font-sans` 토큰 한 경로로 통일

2. 중기(권장)

- `next/font/local`로 NanumSquare 또는 브랜드 폰트 셀프 호스팅
- `layout.tsx`에서 폰트 변수 주입 후 `font-sans`와 연결

### 10.3 현재 방식(AS-IS)

```tsx
// src/app/layout.tsx
<head>
	<link href="https://hangeul.pstatic.net/hangeul_static/css/nanum-square.css" rel="stylesheet" />
</head>
```

```css
/* src/index.css */
@theme inline {
	--font-sans: 'Pretendard', ui-sans-serif, system-ui, ...;
}

body {
	font-family: 'NanumSquare', sans-serif;
}
```

### 10.4 권장 방식(TO-BE, local font)

```tsx
// src/app/layout.tsx
import localFont from 'next/font/local';

const nanumSquare = localFont({
	src: './fonts/NanumSquare.woff2',
	variable: '--font-nanum-square',
	display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<body className={`${nanumSquare.variable} font-sans`}>{children}</body>
		</html>
	);
}
```

```css
/* src/index.css */
@theme inline {
	--font-sans: var(--font-nanum-square), ui-sans-serif, system-ui, sans-serif;
}

/* body의 font-family 직접 지정은 제거 */
```

### 10.5 구현/검증 체크리스트

- [ ] `body`의 직접 `font-family` 지정 제거 또는 의도적으로 유지할지 결정
- [ ] `font-sans` 토큰을 단일 소스로 통일
- [ ] `next/font` 전환 시 `src/app/fonts/*.woff2` 준비
- [ ] 적용 후 CLS/FOUT 체감 및 Lighthouse 점검
- [ ] 폴백 스택(`system-ui`, `sans-serif`) 유지

---

## 11. 3순위: 스크립트 최적화

외부 스크립트는 초기 렌더를 쉽게 막습니다. 현재 프로젝트는 카카오맵 SDK를 전역으로 먼저 불러오고 있어 페이지 단위 최적화가 필요합니다.

### 11.1 현재 상태 (프로젝트 기준)

- `src/app/layout.tsx`에서 카카오맵 SDK를 전역 `beforeInteractive`로 로딩 중
- `LessonTabContent`, `LessonClientTabContent` 등 지도 컴포넌트는 `window.kakao.maps.load`에 의존
- 즉, 지도가 없는 페이지도 카카오 스크립트를 초기 로딩에서 받는 구조

### 11.2 목표 전략

1. 전역 스크립트 최소화

- `layout.tsx`에는 정말 필수인 스크립트만 유지

2. 페이지 단위 스크립트 로딩

- 지도 핵심 페이지: `afterInteractive`
- 하단/보조 지도: `lazyOnload`

3. 보조 SDK 지연

- 결제/주소검색 등은 `lazyOnload`로 이동

### 11.3 카카오맵 페이지 단위 로딩 템플릿

```tsx
'use client';

import Script from 'next/script';
import { useState } from 'react';

export default function MapPage() {
	const [mapReady, setMapReady] = useState(false);

	return (
		<>
			<Script
				src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`}
				strategy="afterInteractive"
				onLoad={() => {
					window.kakao.maps.load(() => setMapReady(true));
				}}
			/>
			{mapReady && <div id="map" className="h-96" />}
		</>
	);
}
```

### 11.4 보조 SDK `lazyOnload` 템플릿

```tsx
import Script from 'next/script';

<>
	<Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="lazyOnload" />
	<Script
		src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
		strategy="lazyOnload"
	/>
</>;
```

### 11.5 적용/검증 체크리스트

- [ ] `layout.tsx` 전역 카카오 Script 유지 필요성 재검토
- [ ] 지도가 필요한 페이지로 Script 주입 위치 이동
- [ ] `autoload=false` 유지 시 `window.kakao.maps.load` 호출 시점 검증
- [ ] 전역 + 페이지 중복 주입 여부 점검
- [ ] Lighthouse에서 TBT/INP 및 초기 JS 영향 확인

---

## 12. 3순위: 코드 스플리팅

### 현재 상태 (프로젝트 기준)

- 현재 코드베이스에 `next/dynamic` 적용이 사실상 없음
- App Router 페이지에서도 무거운 컴포넌트를 정적 import 중:
    - `KakaoMapView` (지도 SDK, `window.kakao` 의존)
    - `CreateMeetingModal` (모달)
    - `AllReviewsModal` (리뷰 전체 모달)

### 적용 기준

1. 페이지 진입 시 바로 보이지 않는 UI
2. SDK/지도처럼 번들 크기가 큰 컴포넌트
3. 사용자 액션(버튼 클릭) 이후에만 필요한 컴포넌트

### 우선 적용 대상 (현재 코드 기준)

1. `src/app/lessons/[lessonId]/_components/LessonClientTabContent.tsx`

- `KakaoMapView` 동적 import + `ssr: false`

2. `src/components/features/lessons/LessonTabContent.tsx`

- `KakaoMapView` 동적 import + `ssr: false`

3. `src/app/meetings/[meetingId]/MeetingDetailClient.tsx`

- `KakaoMapView` 동적 import + `ssr: false`
- `CreateMeetingModal` 동적 import (모달 열릴 때만 로드)

4. `src/components/features/lessons/ReviewList.tsx`

- `AllReviewsModal` 동적 import (이미 `isModalOpen` 조건부 렌더링 중이라 효과 큼)

5. `src/components/features/modal/create/CreateClassModal.tsx` / `src/components/features/home/ReviewModal.tsx`

- 홈/마이페이지 등에서 즉시 노출되지 않으면 dynamic 적용 후보로 관리

### 예시 1) 지도 컴포넌트 스플리팅

```tsx
import dynamic from 'next/dynamic';

const KakaoMapView = dynamic(() => import('@/components/features/map/kakaoMaps/KakaoMapView'), {
	ssr: false, // window/kakao 객체 의존
	loading: () => <div className="h-96 bg-muted">지도를 불러오는 중...</div>,
});
```

### 예시 2) 모달 컴포넌트 스플리팅

```tsx
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AllReviewsModal = dynamic(
	() => import('@/components/features/lessons/AllReviewsModal').then((m) => m.AllReviewsModal),
	{ loading: () => null },
);

function ReviewSection() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button onClick={() => setOpen(true)}>후기 전체보기</button>
			{open && <AllReviewsModal reviews={[]} isOpen={open} onClose={() => setOpen(false)} />}
		</>
	);
}
```

### 예시 3) 페이지 기준 적용 원칙

```tsx
// AS-IS: 페이지 최상단에서 무거운 컴포넌트 정적 import
// TO-BE: 화면 하단/모달 컴포넌트는 dynamic import로 지연 로딩
```

### 설정 병행 체크포인트

1. `ssr: false`는 `window`/DOM 의존 컴포넌트에만 사용
2. dynamic 대상은 상호작용 후 노출되는 컴포넌트부터 우선 적용
3. loading fallback은 레이아웃 점프가 없도록 높이 고정
4. Lighthouse와 번들 분석으로 초기 JS 크기 감소 확인
5. App Router 우선 적용 후, 필요 시 `src/pages/**` 레거시 화면으로 확장
6. 이미 조건부 렌더링 중인 모달은 dynamic 적용 시 효과가 큼

---

## 13. 배포 전 최종 점검 체크리스트

### A. 1순위 필수 (배포 전 완료)

#### 파일 기반 메타데이터

- [ ] `src/app/robots.ts` 작성
- [ ] `src/app/sitemap.ts` 작성
- [ ] `src/app/lessons/[lessonId]/opengraph-image.tsx` 작성
- [ ] `public/moaclass-icon.svg` 유지 또는 `src/app/favicon.ico` 추가
- [ ] `/robots.txt`, `/sitemap.xml` 응답 확인

#### 동적/정적 메타데이터

- [ ] `src/app/lessons/[lessonId]/page.tsx`에서 실데이터 기반 `generateMetadata` 적용
- [ ] `src/app/meetings/[meetingId]/page.tsx`에 `generateMetadata` 신규 적용
- [ ] `src/app/lessons/page.tsx` 정적 metadata 적용
- [ ] `src/app/meetings/page.tsx` 정적 metadata 적용
- [ ] `src/app/meetings/search/page.tsx` 정적 metadata 적용
- [ ] invalid ID/404 fallback + `robots: noindex` 처리

#### 시맨틱 태그

- [ ] `src/components/common/next/HeaderNext.tsx`에 `header/nav` 구조 적용
- [ ] `src/components/common/Footer.tsx`를 `footer`로 명시
- [ ] `src/app/lessons/[lessonId]/LessonClient.tsx`에 `article/aside` 구조 반영
- [ ] 페이지별 `h1` 1개 원칙 점검 (`ClassDashboardPage` 포함)

### B. 2순위 권장 (검색 품질 개선)

#### JSON-LD

- [ ] 레슨 상세(`Course`) JSON-LD 적용
- [ ] 모임 상세(`Event`) JSON-LD 적용
- [ ] 목록(`ItemList`)은 데이터 안정화 후 선택 적용
- [ ] Rich Results Test로 문법 검증

#### Canonical

- [ ] `src/app/layout.tsx`에 `metadataBase` 설정
- [ ] 홈/목록/상세 canonical 적용
- [ ] 쿼리 파라미터 canonical 정책 문서/코드 일치 확인

#### Open Graph(수동)

- [ ] 전역 fallback OG 유지 (`layout.tsx`)
- [ ] 홈/목록/검색 페이지 수동 OG 적용
- [ ] 레슨 상세는 동적 OG(`opengraph-image.tsx`) 우선 적용

### C. 3순위 성능 최적화

#### 이미지

- [ ] `LessonCard`, `LessonGallery`, `TopicCard`를 `next/image`로 전환 시작
- [ ] LCP 후보 이미지에만 `priority` 적용
- [ ] `next.config.ts` 이미지 도메인 허용 점검

#### 폰트

- [ ] `layout.tsx` 외부 폰트 링크 유지/제거 결정
- [ ] `next/font` 전환 시 `src/app/fonts/*.woff2` 준비
- [ ] `font-sans`와 CSS 변수 연결 확인

#### 스크립트/스플리팅

- [ ] 전역 `beforeInteractive` 유지 필요성 재검토
- [ ] 카카오맵/결제/주소검색 스크립트 전략 재배치(`afterInteractive`/`lazyOnload`)
- [ ] `KakaoMapView`, 모달류 dynamic import 우선 적용
- [ ] `ssr: false` 사용 대상을 window 의존 컴포넌트로 제한

### D. 검증/운영

- [ ] 문서 경로/예시 코드가 실제 프로젝트 구조와 일치
- [ ] 예시 API명이 실제 코드(`fetchLesson`, `getMeetingById`)와 일치
- [ ] UTF-8 인코딩 깨짐 없음
- [ ] Lighthouse + Web Vitals + 공유 미리보기(카카오/슬랙) 최종 확인

---

## 14. 구현 일정 가이드라인 (권장 3일 플랜)

### Day 1 (크롤링/메타 기본기 완성)

1. 파일 기반 메타데이터

- `robots.ts`, `sitemap.ts` 작성
- `/robots.txt`, `/sitemap.xml` 응답 확인

2. 기본 메타데이터 정리

- `layout.tsx`의 `metadataBase` 적용
- 홈/목록(`lessons`, `meetings`, `meetings/search`) 정적 metadata + canonical 적용

3. 공유 기본값 정리

- 전역 fallback OG 정리(`layout.tsx`)
- favicon 전략 확정(`public` 유지 또는 `src/app/favicon.ico` 추가)

### Day 2 (상세 페이지 SEO 핵심 적용)

1. 동적 메타데이터

- `lessons/[lessonId]` `generateMetadata` 실데이터 연동
- `meetings/[meetingId]` `generateMetadata` 신규 적용
- invalid ID/404 fallback + `noindex` 처리

2. 상세 canonical/OG

- 상세 canonical 적용(`/lessons/{id}`, `/meetings/{id}`)
- 레슨 상세 `opengraph-image.tsx` 적용

3. 구조화 데이터

- 레슨 `Course` JSON-LD 적용
- 모임 `Event` JSON-LD 적용

### Day 3 (품질 검증 + 성능 1차)

1. 시맨틱 태그 1차 반영

- `HeaderNext`(`header/nav`), `Footer`(`footer`), `LessonClient`(`article/aside`) 적용
- `h1` 중복 점검

2. 성능 1차 최적화

- `next/image` 전환 시작(`LessonCard`, `LessonGallery`, `TopicCard`)
- LCP 후보 이미지 `priority` 적용
- 카카오맵 스크립트 전략 재배치(`beforeInteractive` 최소화)
- `KakaoMapView`/모달 dynamic import 1차 적용

3. 최종 검증

- Rich Results Test(JSON-LD)
- Lighthouse/Web Vitals(LCP/CLS/TBT)
- 카카오/슬랙 공유 미리보기 확인

### 완료 기준 (Definition of Done)

1. 기술 기준

- robots/sitemap/canonical/OG/JSON-LD가 문서 기준으로 적용 완료
- 주요 공개 페이지에서 메타데이터 누락 없음

2. 품질 기준

- LCP/CLS 지표 악화 없음(기존 대비 유지 또는 개선)
- 카카오/슬랙 공유 미리보기 정상 노출

3. 운영 기준

- 가이드 문서(`seo_guide.md`)와 실제 구현 상태가 일치
