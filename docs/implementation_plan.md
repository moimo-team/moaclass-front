# 구현 계획 - `CreateClassModal` 테스트

이 계획은 `CreateClassModal` 컴포넌트에 대한 테스트 환경 구축 및 상세 테스트 케이스 설계를 목표로 합니다.

## 1. 테스트 환경 설정

- [ ] 필수 테스트 의존성 설치 (완료):
    - `vitest` (테스트 러너)
    - `@testing-library/react` (컴포넌트 테스트)
    - `@testing-library/jest-dom` (DOM 매치)
    - `@testing-library/user-event` (사용자 상호작용 시뮬레이션)
    - `jsdom` (웹 표준 API 시뮬레이션)
- [ ] `vite.config.ts`에 Vitest 설정 추가.
- [ ] `src/test/setup.ts` 생성 (전역 테스트 설정, e.g., `import '@testing-library/jest-dom'`).
- [ ] `package.json`에 `test` 스크립트 추가.

## 2. `CreateClassModal` 테스트 케이스 설계

### 렌더링 및 초기 상태

- [ ] **생성 모드:** "새 클래스 만들기" 제목이 표시되고 기본값/빈 값이 채워져 있는지 확인.
- [ ] **수정 모드:** "클래스 정보 수정하기" 제목이 표시되고 `existingLesson` 데이터가 폼에 채워져 있는지 확인.
- [ ] **로딩 상태:** `isFormReady`가 false일 때 로딩 스피너가 표시되는지 확인.

### 유효성 검사 (Zod 스키마)

- [ ] **필수 필드:** 제목, 카테고리, 지역 등 필수 항목 누락 시 에러 메시지 확인.
- [ ] **길이 제한:**
    - 제목: 1자 이상 100자 이내 통과 확인.
    - 커리큘럼: 40자 미만 또는 600자 초과 시 에러 메시지 확인.
- [ ] **제출 버튼 활성화:** 폼이 유효하지 않을 때 (`isValid`가 false) 버튼이 비활성화되는지 확인.

### 컴포넌트 상호작용

- [ ] **카테고리 선택:**
    - `useCategoryQuery` 모킹하여 카테고리 목록 제공.
    - 대분류 선택 시 해당 소분류 목록이 호출되고 렌더링되는지 확인.
- [ ] **슬라이더 조작:**
    - 소요 시간, 최대 인원, 예약 가능 기간 슬라이더 값이 정상적으로 업데이트되는지 확인.
- [ ] **가격 계산:**
    - 가격과 할인율 입력 시 "최종 판매가"가 올바르게 계산되어 표시되는지 확인.
- [ ] **이미지 업로드:**
    - 대표 이미지 및 추가 이미지 선택 시 미리보기가 변경되는지 확인 (시뮬레이션).

### API 연동 및 제출

- [ ] **생성 성공:**
    - `useCreateLessonMutation` 모킹.
    - 폼 입력 후 "생성하기" 클릭 시 `mutateAsync`가 올바른 `FormData`와 함께 호출되는지 확인.
- [ ] **수정 성공:**
    - `useUpdateLessonMutation` 모킹.
    - 필드 수정 후 "수정하기" 클릭 시 `lessonId`와 업데이트된 `FormData`가 전달되는지 확인.
- [ ] **성공/실패 알림:** 성공 또는 에러 시 Toast 메시지가 올바르게 표시되는지 확인.

## 3. 구현 단계

1. `src/components/features/modal/create/CreateClassModal.test.tsx` 파일 생성.
2. TanStack Query 훅 및 외부 라이브러리(카카오맵 등) 모킹.
3. 설계된 테스트 케이스 순차적 구현.
4. 테스트 실행 및 결과 확인 후 보정.
