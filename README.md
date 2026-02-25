# 🌐 MoaClass Frontend (모아클래스 프론트엔드)

모아클래스(MoaClass)는 관심사 기반 클래스/모임 탐색, 신청, 결제, 채팅, 마이페이지 기능을 제공하는 프론트엔드 애플리케이션입니다.  
`React 19`와 `TypeScript`를 기반으로, `Next.js(App Router)` 중심 구조로 운영하며 일부 레거시 페이지를 함께 관리하고 있습니다.

## 🛠 기술 스택 (Tech Stack)

### Core
- Framework: `Next.js 16` (App Router)
- Library: `React 19`
- Language: `TypeScript`
- Runtime/Package Manager: `Node.js`, `npm`

### Routing
- Primary: `next/navigation`, `next/link`
- Legacy coexistence: `react-router-dom v7`

### State Management
- Server State: `@tanstack/react-query v5`
- Client State: `zustand`
- Form State: `react-hook-form` + `zod` + `@hookform/resolvers`

### API & Real-time
- HTTP Client: `axios`
- Real-time: `socket.io-client`
- API Mocking: `MSW (Mock Service Worker)`
- Mock Data: `@faker-js/faker`

### UI & Styling
- Styling: `Tailwind CSS v4`
- UI Components: `shadcn/ui` + `Radix UI`
- Icons: `lucide-react`, `react-icons`
- Animation: `framer-motion`, `tailwindcss-animate`
- Toast: `sonner`

### Quality & Tooling
- Lint: `ESLint 9`
- Format: `Prettier`
- Test: `Vitest`, `Testing Library`, `jsdom`
- Git Hooks: `husky`, `lint-staged`

## 📁 프로젝트 구조 (Project Structure)

```text
src/
├── api/                # 도메인별 API 호출 함수
├── app/                # Next.js App Router 페이지/레이아웃
├── assets/             # 정적 리소스
├── components/
│   ├── ui/             # shadcn/ui 기반 공용 UI
│   ├── common/         # 공통 컴포넌트
│   ├── features/       # 도메인 기능 컴포넌트
│   └── providers/      # 전역 Provider(Query, OAuth, MSW 등)
├── config/             # 환경/설정 상수
├── constants/          # 공통 상수
├── hooks/              # 데이터 패칭/비즈니스 커스텀 훅
├── lib/                # QueryClient, socket, 유틸 설정
├── mock/               # MSW 핸들러/목 데이터
├── models/             # 타입/도메인 모델
├── store/              # Zustand 전역 상태
├── test/               # 테스트 유틸
├── utils/              # 순수 유틸 함수
├── v-pages/            # 레거시 페이지(점진적 마이그레이션 대상)
├── index.css           # 글로벌 스타일
└── main.tsx            # 레거시 엔트리
```

## 💡 개발 및 코딩 컨벤션

### 1) 상태 관리 전략
- 서버 데이터는 `React Query`로 관리하고, 쿼리 키 기반 캐싱/무효화 전략을 사용합니다.
- UI 중심 전역 상태는 `Zustand`로 경량 관리합니다.
- 폼 상태와 검증은 `React Hook Form + Zod` 조합을 기본으로 사용합니다.

### 2) 컴포넌트 설계 원칙
- `ui`의 공용 컴포넌트를 조합해 `features` 단위 기능 컴포넌트를 구성합니다.
- 비즈니스 로직과 데이터 연동은 커스텀 훅으로 분리해 뷰 컴포넌트의 책임을 줄입니다.

### 3) API/실시간 통신
- HTTP 통신은 `axios` 클라이언트로 통일합니다.
- 실시간 알림/채팅은 `socket.io-client`를 통해 처리합니다.
- 백엔드 연동 전/테스트 상황에서는 `MSW`로 API를 모킹합니다.

### 4) 품질 관리
- 커밋 전 `husky + lint-staged`로 린트/포맷을 자동 실행합니다.
- 단위/컴포넌트 테스트는 `Vitest + Testing Library` 기반으로 작성합니다.

## ⚙️ 시작하기 (Getting Started)

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 프로덕션 빌드
```bash
npm run build
```

### 4. 프로덕션 실행
```bash
npm run start
```

### 5. 린트 체크
```bash
npm run lint
```

### 6. 테스트 실행
```bash
npm run test
```

## 📌 참고
- 현재 저장소는 `Next.js App Router` 중심으로 운영 중이며, 일부 화면은 레거시 구조(`v-pages`, `react-router-dom`)와 공존합니다.
- 신규 기능은 App Router 기준으로 개발하고, 레거시 영역은 점진적으로 이전하는 방향을 권장합니다.
