---
name: moaclass-coding-standards
description: MoaClass 프로젝트의 코딩 표준 및 Agent가 따라야 할 규칙
---

# MoaClass 코딩 표준 (Agent Guide)

이 문서는 MoaClass 프로젝트에서 코드를 작성할 때 Agent가 반드시 준수해야 할 규칙입니다.

---

## 📋 TypeScript 규칙

### 1. `any` 타입 절대 금지

```typescript
// ❌ 절대 하지 말 것
const data: any = response.data;

// ✅ 올바른 방법
interface ResponseData {
	id: number;
	name: string;
}
const data: ResponseData = response.data;

// ✅ 타입을 정말로 알 수 없을 경우
const data: unknown = response.data;
```

### 2. 명시적 타입 선언

```typescript
// ❌ 타입 추론에만 의존하지 말 것
const items = data.map((item) => item.name);

// ✅ 명시적 타입 선언
const items: string[] = data.map((item: Item) => item.name);
```

### 3. Optional Chaining & Nullish Coalescing 활용

```typescript
// ✅ 안전한 접근
const userName = user?.name ?? 'Unknown';
```

---

## 🎨 ESLint 규칙 준수

### 현재 프로젝트 ESLint 설정

- **Base**: ESLint recommended
- **TypeScript**: TypeScript ESLint recommended
- **React**: React Hooks rules
- **React Refresh**: Vite 최적화

### Agent가 지켜야 할 사항

1. **코드 작성 후 항상 ESLint 에러 확인**
2. **Lint 에러가 있으면 즉시 수정**
3. **자동 수정 가능한 경우 `eslint --fix` 제안**

---

## ✍️ 코드 포맷팅 규칙 (Prettier & Husky)

### 1. 자동 포맷팅 준수

프로젝트에 **Husky**와 **lint-staged**가 설정되어 있어 커밋 시 자동으로 **Prettier**와 **ESLint**가 실행됩니다. 따라서 에이전트는 작성된 코드의 스타일이 `.prettierrc.json`과 일치하는지 항상 확인해야 합니다.

### 2. 주요 설정 가이드

- **들여쓰기**: 탭(Tabs) 사용, 너비 4칸
- **따옴표**: 홑따옴표(`'`) 사용 (JSX 내 속성 제외)
- **세미콜론**: 항상 사용
- **파일 끝 빈 줄**: 항상 포함 (EOL)

```typescript
// ✅ 프로젝트 표준 포맷팅 (Prettier 설정 적용)
export function example(name: string): string {
	const message = `Hello, ${name}!`; // 탭 들여쓰기 (4칸)
	return message;
}
```

---

## 🏗️ 프로젝트 아키텍처 규칙

### 1. 파일 구조

#### API 함수는 `/src/api`에

```typescript
// src/api/lesson.api.ts
export const fetchLessons = async (): Promise<Lesson[]> => {
	const { data } = await httpClient.get('/lessons');
	return data;
};
```

#### 커스텀 훅은 `/src/hooks`에

```typescript
// src/hooks/useLessonsQuery.ts
export const useLessonsQuery = () => {
	return useQuery({
		queryKey: ['lessons'],
		queryFn: fetchLessons,
	});
};
```

#### 타입/인터페이스는 `/src/models`에

```typescript
// src/models/lesson.model.ts
export interface Lesson {
	id: number;
	title: string;
	// ...
}
```

#### 공통 설정은 `/src/lib`에

```typescript
// src/lib/queryClient.ts
export const queryClient = new QueryClient({ ... });
```

### 2. Import 자동화 (정렬 및 제거)

프로젝트에 설정된 ESLint 규칙에 의해 **Import 순서가 자동으로 정렬**되고, **사용하지 않는 Import는 자동으로 제거**됩니다.

- **자동 정렬 순서**:
    1. React 관련 모듈
    2. 외부 라이브러리
    3. 내부 모듈 (절대 경로 `@/**`)
    4. 상대 경로 모듈 (`./`, `../`)
- **작업 가이드**: 에이전트는 import 순서를 수동으로 맞추려 애쓰기보다, 코드를 작성한 후 `eslint --fix`를 실행하거나 커밋 프로세스(`lint-staged`)에 맡기면 됩니다. (단, 린트 에러가 발생하지 않는지는 확인 필수)

---

## 🔍 API 검증 및 작업 원칙

에이전트는 API 관련 작업을 수행할 때 반드시 다음 원칙을 준수해야 합니다.

### 1. 백엔드 컨트롤러가 유일한 진실 (Single Source of Truth)

프론트엔드의 기존 코드나 이전의 대화 내용을 맹목적으로 믿지 마세요. API 엔드포인트, 파라미터, 응답 구조를 확인할 때는 반드시 다음 순서로 확인합니다.

1.  **`moaclass-back`의 Controller 코드 확인**: 실제 서버에서 돌아가는 코드가 가장 정확한 정보입니다.
2.  **`api_spec.md` 문서 확인**: 설계 의도를 파악합니다.
3.  **특정 라인 번호 기반 검증**: "대충 맞다"고 판단하지 말고, 컨트롤러의 몇 번째 라인에서 어떤 데코레이터(`@Get`, `@Query` 등)를 사용했는지 근거를 대며 검토하세요.

### 2. 관성적인 수정 금지

"기존에 `/latest`가 붙어있으니까 당연하겠지"라고 가정하지 마세요. 설계 문서나 백엔드 컨트롤러에 없는 경로나 파라미터가 프론트엔드 코드에 있다면 과감하게 의심하고 수정해야 합니다.

### 3. 나무말고 숲을 보라

전체적으로 흐름을 체크하고 왜 필요한지 파악한 뒤 세부적으로 수정하세요.
필요한 기능이 없다고 판단하거나, 불필요한 기능이라고 속단하지 말고 연관된 파트의 흐름을 체크하고 왜 이게 필요할지 파악하세요.
수정은 그 후에 차차 한 단계씩 진행합니다.

### 4. 기획에 꼭 필요한 기능이자 백엔드에 요구되어야 할 사양을 멋대로 판단하여 지워버리지 않기

프론트엔드의 기획에 꼭 필요한 기능이자 백엔드에 요구되어야 할 사양을 멋대로 판단하여 지워버리지 않기

### 5. API 감사 및 통합 5계명 (Error-Free API Integration)

오류 없는 코드와 백엔드와의 완벽한 공조를 위해 다음 원칙을 반드시 준수합니다.

1.  **의도의 재구성 (생각 3회 원칙)**: 기존 코드에 있는 방어 로직(예: null 차단, 배열의 쉼표 직렬화 등)을 지우기 전, 백엔드 DTO가 요구하는 '데이터의 순수성'을 먼저 파악하세요.
2.  **프론트엔드는 명세서의 집행자**: 백엔드 컨트롤러에 당장 구현이 없더라도 기획서/명세서에 있는 기능이라면 제거하지 말고 **사양(Specification)**으로 남겨두세요. 프론트의 API 정의는 백엔드 팀에게 보내는 구현 가이드입니다.
3.  **연결 고리 전수 조사 (Side Effect Trace)**: API 이름이나 경로, 반환 구조를 변경할 때는 이를 사용하는 모든 **Hook과 Component를 `grep`으로 수색**하여 에러를 예방하세요.
4.  **모델의 완전성 (Type Precision)**: `LessonSchedule`과 `Schedule` 같이 유사한 모델들 사이에서 `id`, `status`, `createdAt` 등의 필드가 누락되지 않도록 일치시켜 타입 에러를 원천 차단하세요.
5.  **전역 설정과의 조화**: 개별 Hook에서 `staleTime`, `retry` 등을 설정하기 전, `queryClient.ts`에 정의된 전역 기본값과 중복되거나 충돌하지 않는지 확인하세요.

---

## 🔄 React Query 규칙

### 1. 전역 설정 활용

```typescript
// ❌ 개별 훅에서 중복 설정하지 말 것
useQuery({
	queryKey: ['lessons'],
	queryFn: fetchLessons,
	staleTime: 1000 * 60 * 5, // 중복!
	retry: 1, // 중복!
});

// ✅ 전역 설정과 다를 때만 명시
useQuery({
	queryKey: ['lessons'],
	queryFn: fetchLessons,
	staleTime: 0, // 의도적으로 즉시 무효화
});
```

### 2. Query Key 네이밍

```typescript
// ✅ 계층적 구조
['lessons'][('lessons', 'latest')][('lessons', params)][('lessons', lessonId)]; // 모든 lessons // 최신 lessons // 필터된 lessons // 특정 lesson
```

### 3. Mutation 후 Invalidation

```typescript
// ✅ 항상 관련 쿼리 무효화
useMutation({
	mutationFn: createLesson,
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['lessons'] });
	},
});
```

---

## ⚛️ React 컴포넌트 규칙

### 0. 컴포넌트 재사용성 확인 (최우선)

**새로운 컴포넌트를 만들기 전에 반드시 다음 사항을 확인하세요:**

1.  **기존 컴포넌트 탐색**: `/src/components/common` 또는 `/src/components/ui`에 이미 유사한 기능을 수행하는 컴포넌트가 있는지 확인합니다.
2.  **확장성 고려**: 기존 컴포넌트에 간단한 props를 추가하여 해결할 수 있다면, 새로 만들기보다 기존 코드를 확장/개선합니다.
3.  **DRY 원칙**: 동일한 UI 패턴(버튼, 입력창, 카드 등)이 반복된다면 공통 컴포넌트로 추출하여 사용합니다.

---

### 1. 파생 값은 State가 아닌 계산

```typescript
// ❌ 불필요한 상태
const [isFormReady, setIsFormReady] = useState(false);
useEffect(() => {
	setIsFormReady(open && data && !isLoading);
}, [open, data, isLoading]);

// ✅ 파생 값으로 계산
const isFormReady = open && !!data && !isLoading;
```

### 2. 명확한 Boolean 변수명

```typescript
// ❌ 애매한 이름
const [open, setOpen] = useState(false);

// ✅ is~ 또는 has~ 접두사
const [isOpen, setIsOpen] = useState(false);
const [hasError, setHasError] = useState(false);
```

### 3. Props 타입 정의

```typescript
// ✅ 항상 interface로 정의
interface ButtonProps {
	label: string;
	onClick: () => void;
	disabled?: boolean;
}

export const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
	// ...
};
```

### 4. 로딩 상태 처리

#### 전체 페이지 로딩: LoadingSpinner 사용

```tsx
import LoadingSpinner from "@/components/common/LoadingSpinner";

function MyPage() {
  const { data, isLoading } = useQuery(...);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <div>{/* 컨텐츠 */}</div>;
}
```

#### 리스트 로딩: Skeleton 우선 고려

```tsx
import { Skeleton } from "@/components/ui/skeleton";

function LessonList() {
  const { data, isLoading } = useQuery(...);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {data.map(item => <LessonCard key={item.id} lesson={item} />)}
    </div>
  );
}
```

**선택 기준**:

- **LoadingSpinner**: 페이지 전체 로딩, 모달 내부, 간단한 데이터 로딩
- **Skeleton**: 리스트, 카드 그리드, 복잡한 레이아웃 (레이아웃 시프트 방지)

---

## 🎯 에러 핸들링 규칙

### 1. API 함수는 try-catch 없이 순수하게

```typescript
// ✅ React Query가 에러를 처리하도록
export const fetchLessons = async (): Promise<Lesson[]> => {
	const { data } = await httpClient.get('/lessons');
	return data;
};
```

### 2. 에러는 React Query 레벨에서 처리

```typescript
// ✅ 훅 단위 또는 전역 onError
useQuery({
	queryKey: ['lessons'],
	queryFn: fetchLessons,
	onError: (error) => {
		toast.error('레슨을 불러올 수 없습니다.');
	},
});
```

### 3. Toast 사용 (AlertNotification 대신)

```typescript
// ✅ 비침습적 피드백
import { toast } from 'sonner';

toast.success('클래스가 생성되었습니다!');
toast.error('오류가 발생했습니다.');
toast.info('준비 중인 기능입니다.');
```

---

## 📝 주석 규칙

### 핵심 원칙: **"코드로 설명할 수 없는 것만 주석으로"**

주석은 **"왜"**를 설명할 때만 작성합니다. **"무엇"**을 하는지는 코드 자체가 설명해야 합니다.

### ❌ 나쁜 주석 (삭제하세요)

```typescript
// 사용자 이름을 가져옴
const userName = user.name;

/** 레슨 목록을 조회합니다 */
export const fetchLessons = async () => { ... }

// 로딩 중일 때
if (isLoading) return <LoadingSpinner />;
```

**문제**: 함수명/변수명만 봐도 알 수 있는 내용을 반복

### ✅ 좋은 주석 (이유를 설명)

```typescript
// staleTime 0: 찜 목록은 실시간성이 중요하므로 항상 최신 데이터 필요
staleTime: (0,
	// 백엔드가 배열로 받으므로 개별/반복 등록 모두 단일 POST
	await apiClient.post(`/lessons/${id}/schedules`, schedulesData));

// Safari Date 생성자 이슈 회피
const date = parseISO(dateString);
```

### 주석이 필요한 경우만

1. **비즈니스 로직의 이유**

    ```typescript
    // 24시간 이내 취소는 수수료 50% (정책)
    const fee = isCanceledWithin24Hours ? price * 0.5 : 0;
    ```

2. **기술적 제약/해결책**

    ```typescript
    // HACK: 백엔드 null 응답 대응 (TODO: #234 이후 제거)
    const data = response.data ?? [];
    ```

3. **복잡한 알고리즘의 의도**
    ```typescript
    // 캘린더 7열 맞추기 위해 이전/다음 달 포함
    const start = startOfWeek(monthStart, { weekStartsOn: 0 });
    ```

### 요약: 의심스러우면 삭제

- 주석 < 명확한 변수명
- "무엇"은 코드가, "왜"만 주석으로
- 불필요한 주석은 노이즈

## 🛠️ Agent 작업 체크리스트

코드를 작성한 후 항상 확인:

- [ ] `any` 타입을 사용하지 않았는가?
- [ ] ESLint 및 Prettier 에러가 없는가? (lint-staged 통과 확인)
- [ ] 파일이 올바른 폴더에 위치하는가?
- [ ] Import 순서가 정리되었는가?
- [ ] React Query 전역 설정과 중복되는 옵션이 없는가?
- [ ] 파생 값을 불필요하게 state로 관리하지 않는가?
- [ ] Boolean 변수명이 명확한가?
- [ ] Toast를 사용했는가? (AlertNotification 지양)
- [ ] **브라우저 기본 `confirm()` 대신 `ConfirmDialog` 컴포넌트를 사용했는가?**
- [ ] **로딩 처리가 적절한가? (페이지: LoadingSpinner, 리스트: Skeleton 우선 고려)**
- [ ] **불필요한 `console.log`를 모두 제거했는가? (디버그용 로그 지양)**
- [ ] **새 컴포넌트 작성 전 기존 컴포넌트 재사용 가능 여부를 확인했는가?**
- [ ] 주석이 "왜"를 설명하는가? (자명한 주석은 제거했는가?)

**최종 업데이트**: 2026-02-13  
**작성자**: AI Agent (사용자 요청에 따라 작성)
