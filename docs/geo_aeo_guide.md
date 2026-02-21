# GEO/AEO 실행 가이드 (MoaClass Frontend)

이 문서는 MoaClass에 **GEO(Generative Engine Optimization)**와 **AEO(Answer Engine Optimization)**를 실제 적용하기 위한 실행 가이드입니다.  
목표는 검색 노출 자체를 넘어서, AI 답변/즉답 영역에서 MoaClass가 **신뢰 가능한 출처**로 채택되게 만드는 것입니다.

---

## 1. 목표와 범위

## GEO 목표

- ChatGPT, Gemini, Perplexity, Google AI 결과에서 클래스/모임 정보가 인용될 확률을 높임
- 근거 기반 텍스트(정의, 수치, 인용, 전문가 정보) 강화

## AEO 목표

- 질문형 검색/음성 검색에서 짧고 명확한 답변으로 채택
- FAQ/표/리스트 기반으로 즉답 친화 구조 구성

## 우선 적용 페이지

1. `src/app/lessons/[lessonId]/page.tsx` + `src/app/lessons/[lessonId]/LessonClient.tsx`
2. `src/app/meetings/[meetingId]/page.tsx` (+ 연결되는 상세 UI)
3. `src/app/lessons/page.tsx`, `src/app/meetings/page.tsx`, `src/app/meetings/search/page.tsx`
4. (선택) `src/pages/moimer/MoimerIntro.tsx` FAQ 영역

---

## 2. GEO 가이드라인 (프로젝트 적용형)

## 2.1 인용 권위 최적화 (Citation Authority)

- 대상: 강사 소개/모임 호스트 소개
- 적용:
    - 강사/호스트 소개에 경력, 자격, 분야를 **문장으로 명시**
    - `Person` JSON-LD(가능 시) 추가

예시 문구:

- "10년 경력 도예 강사, 홍익대 도예 전공"
- "누적 300회 이상 원데이 클래스 진행"

## 2.2 통계 기반 텍스트 (Statistic-Rich)

- 대상: 레슨 상세 소개, 리뷰 요약
- 적용:
    - 추상 표현 대신 숫자 포함
    - 예: "인기 클래스" → "누적 수강생 1,200명, 평점 4.9/5"

## 2.3 직접 인용구 활용 (Direct Quotation)

- 대상: 리뷰/강사 철학 블록
- 적용:
    - 상단 핵심 리뷰 1~2개는 문장형으로 배치
    - 가능하면 `<blockquote>` 사용

## 2.4 엔티티 정의 (Entity Optimization)

- 대상: 레슨 상세 도입부
- 적용:
    - 도입 첫 문단에 용어 정의 1~2문장
    - 예: "터프팅은 터프팅 건으로 실을 심어 러그를 만드는 섬유 공예입니다."

## 2.5 구조/유창성 (Fluency)

- 대상: 상세 본문 전반
- 적용:
    - `h2`, `h3`, `ul/li`, `p` 구조 유지
    - 긴 문단 분리, 오탈자 제거

---

## 3. AEO 가이드라인 (프로젝트 적용형)

## 3.1 질문형 소제목 + 두괄식 답변

- 대상: 상세 페이지 FAQ/설명 블록
- 규칙:
    - 소제목을 질문형으로 작성
    - 첫 문장에 결론(가격/시간/대상) 배치

예시:

- Q: "초보자도 가능한가요?"
- A: "네, 가능합니다. 수강생의 다수가 초보자이며 기초부터 진행합니다."

## 3.2 FAQ 구조화 데이터 (`FAQPage`)

- 대상: 레슨 상세 페이지 하단 FAQ
- 적용 위치: `src/app/lessons/[lessonId]/page.tsx`

```tsx
const faqLd = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: [
		{
			'@type': 'Question',
			name: '재료비는 별도인가요?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: '아니요. 수강료에 재료비가 포함되어 있습니다.',
			},
		},
		{
			'@type': 'Question',
			name: '초보자도 참여할 수 있나요?',
			acceptedAnswer: {
				'@type': 'Answer',
				text: '네. 초보자를 기준으로 커리큘럼을 구성했습니다.',
			},
		},
	],
};
```

## 3.3 "내 근처" 질의 대응

- 대상: 레슨/모임 위치 섹션
- 적용:
    - 주소 + 랜드마크 설명(예: 강남역 11번 출구 도보 5분)
    - 지도만 보여주지 말고 텍스트로도 명시

## 3.4 표/리스트 우선

- 대상: 커리큘럼, 준비물, 가격 정보
- 적용:
    - 순서형은 `ol/li`
    - 가격/옵션은 가능하면 `table`
    - 이미지에 텍스트를 넣는 방식은 피함

---

## 4. JSON-LD 권장 조합 (MoaClass)

## 레슨 상세 (`Course`)

- 파일: `src/app/lessons/[lessonId]/page.tsx`
- 포함: `name`, `description`, `image`, `offers`, `provider`, `aggregateRating`

## 모임 상세 (`Event`)

- 파일: `src/app/meetings/[meetingId]/page.tsx`
- 포함: `name`, `startDate`, `location`, `organizer`, `eventStatus`

## FAQ (`FAQPage`)

- 파일: `src/app/lessons/[lessonId]/page.tsx`
- 주의: 화면에 실제로 보이는 질문/답변과 동일해야 함

## 선택: 강사 엔티티 (`Person`)

- 파일: 강사 정보를 렌더링하는 상세 페이지
- 값이 비어 있으면 속성 생략

---

## 5. 프로젝트 적용 체크리스트

## 개발

- [ ] `lessons/[lessonId]`에 `Course` + `FAQPage` JSON-LD 삽입
- [ ] `meetings/[meetingId]`에 `Event` JSON-LD 삽입
- [ ] FAQ/가격/커리큘럼을 실제 HTML 텍스트(`h/p/li/table`)로 렌더
- [ ] 위치 정보(주소/랜드마크)를 텍스트로도 노출

## 콘텐츠

- [ ] 소개 도입부에 정의 문장 포함(엔티티 정의)
- [ ] 핵심 문장에 수치 포함(시간/인원/평점/누적 수강생)
- [ ] 상단에 직접 인용 가능한 후기 문장 배치
- [ ] FAQ를 질문-답변 형태로 작성(두괄식)

## 검증

- [ ] Rich Results Test로 JSON-LD 검증
- [ ] AI 검색/요약에서 인용되는 문장 품질 점검
- [ ] 카카오/슬랙 공유 시 텍스트 컨텍스트가 일관적인지 확인

---

## 6. 3일 적용 순서 (GEO/AEO)

1. Day 1

- 레슨 상세에 GEO 텍스트 구조 반영(정의/수치/인용)
- FAQ 섹션 초안 작성

2. Day 2

- `Course` + `FAQPage` JSON-LD 적용
- 모임 상세 `Event` JSON-LD 적용

3. Day 3

- FAQ/본문 문구 품질 보정
- Rich Results Test/공유 미리보기/실검색 질의 점검

---

## 7. 주의사항

1. JSON-LD와 화면 텍스트가 다르면 신뢰도 하락 가능
2. 존재하지 않는 수치/자격/후기 인용은 금지
3. 빈 값 필드는 JSON-LD에서 제외
4. 과도한 키워드 반복보다 문장 명확성 우선

---

## 8. 바로 쓰는 템플릿 (최소 적용용)

## 8.1 레슨 상세 FAQ UI 템플릿

- 파일: `src/app/lessons/[lessonId]/LessonClient.tsx` 또는 하위 컴포넌트

```tsx
const lessonFaq = [
	{
		q: '초보자도 가능한가요?',
		a: '네, 가능합니다. 기초부터 단계별로 진행해 처음 참여하는 분도 따라올 수 있습니다.',
	},
	{
		q: '재료비는 별도인가요?',
		a: '아니요. 수강료에 재료비가 포함되어 있습니다.',
	},
	{
		q: '수업은 얼마나 걸리나요?',
		a: '평균 90분 내외로 진행되며 현장 상황에 따라 약간 달라질 수 있습니다.',
	},
];

<section aria-labelledby="faq-title" className="mt-10">
	<h2 id="faq-title" className="text-2xl font-bold">
		자주 묻는 질문
	</h2>
	<div className="mt-4 space-y-4">
		{lessonFaq.map((item) => (
			<article key={item.q} className="rounded-lg border p-4">
				<h3 className="font-semibold">Q. {item.q}</h3>
				<p className="mt-2 text-sm text-muted-foreground">A. {item.a}</p>
			</article>
		))}
	</div>
</section>;
```

## 8.2 레슨 상세 GEO 도입문 템플릿

- 파일: `src/app/lessons/[lessonId]/LessonClient.tsx`

```tsx
<section aria-labelledby="lesson-definition-title" className="mt-8">
	<h2 id="lesson-definition-title" className="text-xl font-bold">
		클래스 한 줄 정의
	</h2>
	<p className="mt-2">터프팅은 터프팅 건으로 실을 심어 러그를 만드는 섬유 공예입니다.</p>
	<p className="mt-2">이 수업은 평균 90분 동안 진행되며 최대 6명이 함께 참여합니다.</p>
</section>
```

## 8.3 리뷰 인용구 템플릿 (`blockquote`)

- 파일: `src/components/features/lessons/ReviewList.tsx` 또는 상세 탭 상단

```tsx
<section aria-labelledby="best-review-title" className="mt-8">
	<h2 id="best-review-title" className="text-xl font-bold">
		수강생 한마디
	</h2>
	<blockquote className="mt-3 border-l-4 pl-4 italic text-foreground/90">
		"처음엔 어려울 줄 알았는데 2시간 안에 작품을 완성해서 정말 뿌듯했어요."
	</blockquote>
</section>
```

## 8.4 레슨 상세 `Course` + `FAQPage` JSON-LD 템플릿

- 파일: `src/app/lessons/[lessonId]/page.tsx`

```tsx
import type { Metadata } from 'next';
import { fetchLesson } from '@/api/lesson.api';

type Props = { params: { lessonId: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const id = Number(params.lessonId);
	const lesson = await fetchLesson(id);
	return {
		title: `${lesson.title} | 모아클래스`,
		description: lesson.description,
	};
}

export default async function Page({ params }: Props) {
	const id = Number(params.lessonId);
	const lesson = await fetchLesson(id);

	const courseLd = {
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
			price: lesson.discountedPrice ?? lesson.price,
			priceCurrency: 'KRW',
			url: `https://www.moaclass.com/lessons/${id}`,
			availability: 'https://schema.org/InStock',
		},
	};

	const faqLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: '초보자도 가능한가요?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: '네, 가능합니다. 기초부터 단계별로 진행합니다.',
				},
			},
			{
				'@type': 'Question',
				name: '재료비는 별도인가요?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: '아니요. 수강료에 재료비가 포함됩니다.',
				},
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
			/>
			{/* 실제 상세 UI 컴포넌트 */}
		</>
	);
}
```

## 8.5 모임 상세 `Event` JSON-LD 템플릿

- 파일: `src/app/meetings/[meetingId]/page.tsx`

```tsx
import { getMeetingById } from '@/api/meeting.api';

type Props = { params: { meetingId: string } };

export default async function Page({ params }: Props) {
	const id = Number(params.meetingId);
	const meeting = await getMeetingById(id);

	const eventLd = {
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: meeting.title,
		description: meeting.description,
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

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
			/>
			{/* 실제 모임 상세 UI 컴포넌트 */}
		</>
	);
}
```

## 8.6 AEO용 FAQ 콘텐츠 작성 템플릿 (콘텐츠 담당자용)

```md
### Q. [질문을 문장형으로 작성]

A. [첫 문장에 결론] + [두 번째 문장에 근거(숫자/조건)]

예시
Q. 재료비는 별도인가요?
A. 아니요, 수강료에 포함되어 있습니다. 흙/유약/가마 소성 비용까지 포함된 금액입니다.
```
