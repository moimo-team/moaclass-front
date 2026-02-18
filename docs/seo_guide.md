# SEO 메타데이터 작성 가이드

이 문서는 모아클래스 프로젝트에서 SEO 메타데이터를 작성하는 방법을 안내합니다.

## 📋 목차

1. [개요](#개요)
2. [메타데이터 공통 함수](#메타데이터-공통-함수)
3. [정적 메타데이터 작성](#정적-메타데이터-작성)
4. [동적 메타데이터 작성](#동적-메타데이터-작성)
5. [Open Graph 이미지 설정](#open-graph-이미지-설정)
6. [기본 설정 변경](#기본-설정-변경)

---

## 개요

모아클래스는 Next.js의 Metadata API를 활용하여 SEO를 최적화합니다. 모든 페이지에서 일관된 메타데이터 관리를 위해 **공통 함수**를 제공합니다.

### 주요 특징

- ✅ **공통 함수 제공**: `createPageMetadata`를 사용하여 코드 중복 제거
- ✅ **자동 타이틀 포맷**: 모든 페이지 제목에 `| 모아클` 자동 추가
- ✅ **Open Graph 지원**: 카카오톡, 페이스북 등 소셜 미디어 공유 최적화
- ✅ **기본 이미지 제공**: 이미지를 지정하지 않으면 layout의 기본 이미지 사용

---

## 메타데이터 공통 함수

### 위치

[`src/utils/metadata.ts`](file:///c:/devCourse/mentoring/sprint5/moaclass/moaclass-front/src/utils/metadata.ts)

### 함수 시그니처

```typescript
type MetadataParams = {
	title: string; // 페이지 제목 (예: '홈', '클래스 상세 1')
	description: string; // 페이지 설명
	image?: string; // 선택적 Open Graph 이미지 경로
};

function createPageMetadata({ title, description, image }: MetadataParams): Metadata;
```

### 동작 방식

1. **타이틀 자동 포맷**: `title: '홈'` → `'홈 | 모아클'`
2. **Open Graph 설정**: 소셜 미디어 공유 시 표시될 메타데이터 자동 생성
3. **이미지 처리**:
    - `image`를 제공하면 해당 이미지 사용
    - 제공하지 않으면 `layout.tsx`의 기본 이미지 사용

---

## 정적 메타데이터 작성

**정적 메타데이터**는 URL 파라미터 없이 항상 동일한 내용을 표시하는 페이지에 사용합니다.

### 예시: 홈 페이지

**파일**: [`src/app/page.tsx`](file:///c:/devCourse/mentoring/sprint5/moaclass/moaclass-front/src/app/page.tsx)

```tsx
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '홈',
	description: '모아클래스에서 다양한 강의를 만나보세요.',
});

export default function Page() {
	return <HomeClient />;
}
```

### 결과

```html
<title>홈 | 모아클</title>
<meta name="description" content="모아클래스에서 다양한 강의를 만나보세요." />
<meta property="og:title" content="홈 | 모아클" />
<meta property="og:description" content="모아클래스에서 다양한 강의를 만나보세요." />
```

### 이미지 포함 예시

```tsx
export const metadata = createPageMetadata({
	title: '홈',
	description: '모아클래스에서 다양한 강의를 만나보세요.',
	image: '/og-home.png', // Open Graph 이미지 추가
});
```

---

## 동적 메타데이터 작성

**동적 메타데이터**는 URL 파라미터에 따라 내용이 달라지는 페이지에 사용합니다.

### 예시: 클래스 상세 페이지

**파일**: [`src/app/lessons/[lessonId]/page.tsx`](file:///c:/devCourse/mentoring/sprint5/moaclass/moaclass-front/src/app/lessons/[lessonId]/page.tsx)

```tsx
import { createPageMetadata } from '@/utils/metadata';
import type { Metadata } from 'next';

type Props = {
	params: { lessonId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { lessonId } = await params;

	// 현재는 lessonId만 사용하지만, 추후 API 호출로 실제 데이터를 가져올 수 있습니다
	// 예: const lesson = await fetchLesson(lessonId);

	return createPageMetadata({
		title: `클래스 상세 ${lessonId}`,
		description: `클래스 상세 ${lessonId}`,
		// image: lesson.thumbnailUrl,  // API에서 가져온 이미지 사용
	});
}

export default async function LessonDetailPage({ params }: Props) {
	const { lessonId } = await params;
	return <LessonClient lessonId={lessonId} />;
}
```

### URL별 결과

| URL          | 생성되는 타이틀           |
| ------------ | ------------------------- |
| `/lessons/1` | `클래스 상세 1 \| 모아클` |
| `/lessons/2` | `클래스 상세 2 \| 모아클` |
| `/lessons/3` | `클래스 상세 3 \| 모아클` |

### API 데이터 활용 예시

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { lessonId } = await params;

	// API 호출로 실제 클래스 정보 가져오기
	const lesson = await fetch(`/api/lessons/${lessonId}`).then((res) => res.json());

	return createPageMetadata({
		title: lesson.title, // 예: '요가 초급반'
		description: lesson.description, // 예: '초보자를 위한 요가 클래스입니다.'
		image: lesson.thumbnailUrl, // 예: '/images/yoga-class.jpg'
	});
}
```

---

## Open Graph 이미지 설정

### 이미지 파일 위치

모든 Open Graph 이미지는 `public` 폴더에 저장합니다:

```
moaclass-front/
  public/
    og-default.png       # 기본 OG 이미지
    og-home.png          # 홈 전용 이미지
    og-lesson-1.png      # 클래스별 이미지
```

### 권장 이미지 사양

- **크기**: 1200 x 630px (Open Graph 표준)
- **포맷**: PNG, JPG
- **용량**: 8MB 이하
- **파일명**: 영문 소문자, 하이픈 사용 (예: `og-yoga-class.png`)

### 사용 예시

```tsx
export const metadata = createPageMetadata({
	title: '요가 클래스',
	description: '초보자를 위한 요가 클래스입니다.',
	image: '/og-yoga-class.png', // public 폴더 기준 경로
});
```

### 카카오톡 공유 시 표시 예시

```
┌─────────────────────────────┐
│  [썸네일 이미지]              │
│  요가 클래스 | 모아클          │
│  초보자를 위한 요가 클래스입니다. │
└─────────────────────────────┘
```

---

## 기본 설정 변경

### Layout 기본 메타데이터

**파일**: [`src/app/layout.tsx`](file:///c:/devCourse/mentoring/sprint5/moaclass/moaclass-front/src/app/layout.tsx)

```tsx
export const metadata: Metadata = {
	title: '모아클 | MOACLASS',
	description: '모아클 - 모여라 아! 이거다 싶은 클래스',
	icons: {
		icon: '/moaclass-icon.svg',
	},
	openGraph: {
		type: 'website',
		locale: 'ko_KR',
		siteName: '모아클',
		images: [
			{
				url: '/moaclass-icon.svg', // ⚠️ 현재 임시 아이콘 사용 중
				width: 1200,
				height: 630,
				alt: '모아클 - 모여라 아! 이거다 싶은 클래스',
			},
		],
	},
};
```

### 기본 이미지 변경 방법

1. **1200 x 630px 이미지 준비**
2. **`public` 폴더에 저장** (예: `public/og-default.png`)
3. **`layout.tsx` 수정**:

```tsx
openGraph: {
  images: [
    {
      url: '/og-default.png',  // ✅ 새 이미지로 변경
      width: 1200,
      height: 630,
      alt: '모아클 - 모여라 아! 이거다 싶은 클래스',
    },
  ],
}
```

---

## 체크리스트

새 페이지를 추가할 때 다음 사항을 확인하세요:

- [ ] `createPageMetadata` 함수 사용
- [ ] `title`과 `description` 작성
- [ ] 필요 시 `image` 경로 지정
- [ ] 동적 페이지의 경우 `generateMetadata` 함수 사용
- [ ] 브라우저 개발자 도구에서 `<title>`, `<meta>` 태그 확인
- [ ] 카카오톡 공유 테스트 (선택)
