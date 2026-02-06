<!-- ---
name: code-review
description: 코드 리뷰를 수행합니다. PR 리뷰 또는 특정 파일/코드 리뷰가 필요할 때 사용하세요.
argument-hint: [pr-number|file-path]
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
--- -->

<!-- # Code Review

코드 리뷰를 수행합니다. PR 리뷰와 파일/코드 리뷰를 모두 지원합니다.

## 사용법

- `/code-review 123` - PR #123 리뷰
- `/code-review src/components/MyComponent.tsx` - 특정 파일 리뷰
- `/code-review` - 현재 브랜치의 변경사항 리뷰

## 인자 판별

`$ARGUMENTS`를 분석하여 리뷰 대상을 결정합니다:

1. **숫자인 경우**: PR 번호로 인식 → PR 리뷰 수행
2. **파일 경로인 경우**: 해당 파일 리뷰 수행
3. **인자가 없는 경우**: 현재 브랜치의 main 대비 변경사항 리뷰 -->

---

## PR 리뷰 프로세스

### Language

Please provide all code reviews, summaries, and help messages in Korean (한글)


<!-- ### 1. PR 정보 수집

```bash
# PR 기본 정보 확인
gh pr view <pr-number>

# PR diff 확인
gh pr diff <pr-number>

# PR 커밋 목록
gh api repos/{owner}/{repo}/pulls/<pr-number>/commits

# 기존 리뷰 코멘트 확인
gh api repos/{owner}/{repo}/pulls/<pr-number>/comments
```

### 2. 변경된 파일 분석

- 변경된 각 파일의 전체 컨텍스트를 Read 도구로 확인
- 관련 테스트 파일이 있는지 확인
- 영향받는 다른 코드가 있는지 Grep으로 검색 -->

### 3. 리뷰 관점

다음 관점에서 코드를 검토합니다:

#### 기능적 정확성
- 비즈니스 로직이 올바른가?
- 엣지 케이스가 처리되었는가?
- 에러 핸들링이 적절한가?

#### 코드 품질
- 프로젝트 코딩 표준을 준수하는가?
- 불필요한 복잡성이 있는가?
- 중복 코드가 있는가?

#### 보안
- SQL Injection, XSS 등 OWASP Top 10 취약점이 있는가?
- 민감한 정보가 노출되는가?

#### 성능
- 불필요한 리렌더링이 발생하는가?
- 메모이제이션이 적절히 사용되었는가?

#### 테스트
- 테스트가 충분한가?
- 테스트가 올바른 시나리오를 커버하는가?

<!-- 
추후 추가
#### 접근성 및 SEO
- 의미있는 alt 속성 필수
- semantic HTML 태그 사용
- ARIA 레이블 적절히 활용 -->

<!-- ### 4. 리뷰 결과 제공

리뷰 결과를 다음 형식으로 제공합니다:

```markdown
## 리뷰 요약

### ✅ 좋은 점
- ...

### ⚠️ 개선 제안
- ...

### 🔴 수정 필요
- ...

### 💡 참고사항
- ...
``` -->

---
<!-- 
## 파일/코드 리뷰 프로세스

### 1. 대상 파일 읽기

Read 도구를 사용하여 파일 전체를 읽습니다.

### 2. 관련 컨텍스트 수집

- 해당 파일을 참조하는 다른 파일 검색
- 관련 테스트 파일 확인
- 관련 타입/인터페이스 확인

### 3. 리뷰 관점

PR 리뷰와 동일한 관점에서 검토하되, 해당 파일에 집중합니다.

### 4. 리뷰 결과 제공

구체적인 라인 번호와 함께 개선 사항을 제안합니다:

```markdown
## 파일 리뷰: `path/to/Component.tsx`

### 구조 분석
- ...

### 개선 제안

#### L42-48: 불필요한 리렌더링
현재: `useEffect` 의존성 배열에 객체 전체를 전달
제안: 필요한 프로퍼티만 의존성으로 지정
```

---

## 현재 브랜치 리뷰 프로세스

인자가 없는 경우, 현재 브랜치의 main 대비 변경사항을 리뷰합니다.

```bash
# 변경된 파일 목록
git diff main...HEAD --name-only

# 전체 diff
git diff main...HEAD
```

이후 PR 리뷰와 동일한 프로세스를 따릅니다. -->

---

## 프로젝트별 체크리스트

### React + TypeScript 기본

#### 리렌더링 최적화
- [ ] **함수형 setState 사용**: 상태 기반 업데이트 시 `setState(prev => ...)` 형태를 사용하는가?
  ```tsx
  // ❌ Bad: items 의존성 필요, stale closure 위험
  const addItem = useCallback((item) => {
    setItems([...items, item])
  }, [items])

  // ✅ Good: 의존성 불필요, 안전
  const addItem = useCallback((item) => {
    setItems(prev => [...prev, item])
  }, [])
  ```

- [ ] **Lazy State 초기화**: 비용이 큰 초기값은 함수 형태로 전달하는가?
  ```tsx
  // ❌ Bad: 매 렌더마다 실행
  const [data, setData] = useState(expensiveComputation(props))

  // ✅ Good: 최초 렌더 시에만 실행
  const [data, setData] = useState(() => expensiveComputation(props))
  ```

- [ ] **Effect 의존성 최소화**: 객체 전체 대신 필요한 프로퍼티만 의존성으로 지정하는가?
  ```tsx
  // ❌ Bad: user 객체의 어떤 필드가 변경되어도 실행
  useEffect(() => {
    fetchUserData(user.id)
  }, [user])

  // ✅ Good: id가 변경될 때만 실행
  useEffect(() => {
    fetchUserData(user.id)
  }, [user.id])
  ```

- [ ] **파생 상태 구독**: 연속 값 대신 파생된 boolean 상태를 구독하는가?
  ```tsx
  // ❌ Bad: 픽셀 변경마다 리렌더
  const width = useWindowWidth()
  const isMobile = width < 768

  // ✅ Good: boolean 전환 시에만 리렌더
  const isMobile = useMediaQuery('(max-width: 767px)')
  ```

- [ ] **이벤트 핸들러에서 처리**: 사용자 액션 로직을 Effect 대신 이벤트 핸들러에서 처리하는가?
  ```tsx
  // ❌ Bad: 상태 + Effect로 모델링
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => {
    if (submitted) postData()
  }, [submitted])

  // ✅ Good: 핸들러에서 직접 처리
  const handleSubmit = () => postData()
  ```

#### 조건부 렌더링
- [ ] **명시적 조건부 렌더링**: `&&` 대신 삼항 연산자를 사용하여 0, NaN 렌더링 방지하는가?
  ```tsx
  // ❌ Bad: count가 0일 때 "0" 렌더링
  {count && <Badge>{count}</Badge>}

  // ✅ Good: count가 0일 때 아무것도 렌더링하지 않음
  {count > 0 ? <Badge>{count}</Badge> : null}
  ```

#### 정적 요소 호이스팅
- [ ] **정적 JSX 호이스팅**: 정적 JSX 요소를 컴포넌트 외부로 추출하는가?
  ```tsx
  // ❌ Bad: 매 렌더마다 재생성
  function Container() {
    return loading && <div className="skeleton" />
  }

  // ✅ Good: 재사용
  const skeleton = <div className="skeleton" />
  function Container() {
    return loading && skeleton
  }
  ```

### 비동기 처리

- [ ] **병렬 실행**: 독립적인 비동기 작업은 `Promise.all()` 사용하는가?
  ```tsx
  // ❌ Bad: 순차 실행, 3번의 왕복
  const user = await fetchUser()
  const posts = await fetchPosts()
  const comments = await fetchComments()

  // ✅ Good: 병렬 실행, 1번의 왕복
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ])
  ```

- [ ] **Early Return**: 결과가 결정되면 즉시 반환하여 불필요한 처리 방지하는가?
  ```tsx
  // ❌ Bad: 에러 발견 후에도 계속 검사
  function validate(items) {
    let error = null
    for (const item of items) {
      if (!item.valid) error = 'Invalid'
    }
    return error
  }

  // ✅ Good: 첫 에러에서 즉시 반환
  function validate(items) {
    for (const item of items) {
      if (!item.valid) return 'Invalid'
    }
    return null
  }
  ```

### 번들 최적화

- [ ] **Dynamic Import**: 초기 렌더에 불필요한 무거운 컴포넌트는 동적 import 사용하는가?
  ```tsx
  // ❌ Bad: 메인 번들에 포함
  import { HeavyEditor } from './HeavyEditor'

  // ✅ Good: 필요할 때 로드
  const HeavyEditor = lazy(() => import('./HeavyEditor'))
  ```

- [ ] **Barrel Import 회피**: 아이콘, 대형 라이브러리는 직접 경로에서 import 하는가?
  ```tsx
  // ❌ Bad: 전체 라이브러리 로드
  import { Check, X } from 'lucide-react'

  // ✅ Good: 필요한 아이콘만 로드
  import Check from 'lucide-react/dist/esm/icons/check'
  import X from 'lucide-react/dist/esm/icons/x'
  ```

### TanStack React Query

- [ ] **적절한 staleTime 설정**: 데이터 특성에 맞는 staleTime을 설정하는가?
  ```tsx
  // 자주 변경되지 않는 데이터
  useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30, // 30분
  })

  // 자주 변경되는 데이터
  useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 1000 * 10, // 10초
  })
  ```

- [ ] **쿼리 키 구조화**: 쿼리 키가 계층적으로 잘 구조화되어 있는가?
  ```tsx
  // ❌ Bad: 평면적 키
  useQuery({ queryKey: ['user-1-posts'] })

  // ✅ Good: 계층적 키 (무효화에 유리)
  useQuery({ queryKey: ['users', userId, 'posts'] })
  ```

- [ ] **Mutation 후 쿼리 무효화**: mutation 성공 시 관련 쿼리를 무효화하는가?
  ```tsx
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
  ```

- [ ] **Optimistic Update**: 필요한 경우 낙관적 업데이트를 적용하는가?
- [ ] **Error Boundary 연동**: `throwOnError` 옵션 또는 Error Boundary 사용하는가?

### Zustand 상태 관리

- [ ] **Store 분리**: 관심사에 따라 store가 적절히 분리되어 있는가?
- [ ] **선택적 구독**: 필요한 상태만 구독하여 불필요한 리렌더링 방지하는가?
  ```tsx
  // ❌ Bad: 전체 store 구독
  const store = useStore()

  // ✅ Good: 필요한 상태만 구독
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)
  ```

- [ ] **Actions 분리**: 액션을 상태와 함께 정의하고 있는가?
- [ ] **Persist Middleware**: 필요한 경우 상태 영속화가 적용되어 있는가?

### React Hook Form + Zod

- [ ] **Zod 스키마 정의**: 폼 검증에 Zod 스키마를 사용하는가?
  ```tsx
  const schema = z.object({
    email: z.string().email('올바른 이메일을 입력해주세요'),
    password: z.string().min(8, '8자 이상 입력해주세요'),
  })
  ```

- [ ] **zodResolver 사용**: React Hook Form과 Zod를 올바르게 연결하는가?
  ```tsx
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  })
  ```

- [ ] **에러 메시지 표시**: 폼 에러가 사용자에게 명확히 표시되는가?
- [ ] **Submit 중복 방지**: `isSubmitting` 상태로 중복 제출을 방지하는가?

### TypeScript

- [ ] **명시적 타입 정의**: Props, 상태, 함수 반환값에 타입이 정의되어 있는가?
- [ ] **any 사용 회피**: `any` 타입 사용을 최소화하고, 필요시 `unknown`을 사용하는가?
- [ ] **타입 가드 사용**: 조건부 타입 체크 시 타입 가드를 활용하는가?
- [ ] **제네릭 활용**: 재사용 가능한 컴포넌트/함수에 제네릭을 적절히 활용하는가?

### 컴포넌트 구조

- [ ] **단일 책임 원칙**: 컴포넌트가 하나의 역할만 수행하는가?
- [ ] **Props 인터페이스**: Props가 인터페이스로 정의되어 있는가?
- [ ] **기본값 처리**: 선택적 props에 적절한 기본값이 있는가?
- [ ] **children 패턴**: 합성이 필요한 경우 children 패턴을 사용하는가?

### 접근성 (a11y)

- [ ] **시맨틱 HTML**: 적절한 HTML 요소를 사용하는가? (button, nav, main 등)
- [ ] **ARIA 속성**: 필요한 경우 ARIA 속성이 올바르게 적용되어 있는가?
- [ ] **키보드 접근성**: 키보드로 모든 기능에 접근 가능한가?
- [ ] **alt 텍스트**: 이미지에 적절한 alt 텍스트가 있는가?

### 보안

- [ ] **XSS 방지**: `dangerouslySetInnerHTML` 사용 시 sanitize 처리하는가?
- [ ] **민감 정보 노출**: API 키, 토큰 등이 클라이언트 코드에 노출되지 않는가?
- [ ] **입력값 검증**: 사용자 입력을 적절히 검증하는가?