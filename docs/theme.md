# 색상 테마 적용 구현 계획

사용자가 제공한 두 가지 팔레트(**따뜻함 / 캐주얼**, **부드러움 / 안정감**)를 기반으로 애플리케이션의 전체 테마를 업데이트합니다.

---

## 1. 색상 매핑 전략

shadcn/ui의 **CSS 시스템 변수**에 아래와 같이 색상을 매핑합니다.

| 변수명 | 색상값 | 설명 | 출처 |
|------|--------|------|------|
| `--background` | `#FFF9EE` | 웜 화이트 (배경) | Palette 1 |
| `--foreground` | `#2E2E2E` | 텍스트 메인 | Palette 1 |
| `--card` | `#FFFFFF` | 카드 배경 | Palette 1 & 2 |
| `--card-foreground` | `#2E2E2E` | 텍스트 메인 | Palette 1 |
| `--popover` | `#FFFFFF` | 팝오버 배경 | Palette 1 & 2 |
| `--popover-foreground` | `#2E2E2E` | 텍스트 메인 | Palette 1 |
| `--primary` | `#FFC34A` | 메인 옐로 | Palette 1 & 2 |
| `--primary-foreground` | `#2E2E2E` | 텍스트 메인 (대비용) | Palette 1 |
| `--secondary` | `#FFE1A3` | 서브 옐로 (소프트) | Palette 1 |
| `--secondary-foreground` | `#2E2E2E` | 텍스트 메인 | Palette 1 |
| `--muted` | `#EFE4CC` | 보더/디바이더 (배경용) | Palette 1 |
| `--muted-foreground` | `#6B6B6B` | 텍스트 서브 | Palette 1 |
| `--accent` | `#FFD77D` | 말풍선 포인트 옐로 (강조용) | Palette 2 |
| `--accent-foreground` | `#2E2E2E` | 텍스트 메인 | Palette 1 |
| `--destructive` | 기존 값 유지 | 경고 / 삭제 색상 | System |
| `--border` | `#EFE4CC` | 보더 / 디바이더 | Palette 1 |
| `--input` | `#EFE4CC` | 입력 필드 보더 | Palette 1 |
| `--ring` | `#FFC34A` | 포커스 링 (메인 옐로) | Palette 1 & 2 |

---

## 2. 변경 대상 파일

```bash
src/
└── index.css
```



