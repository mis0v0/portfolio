# Portfolio

보안 엔지니어 지망 개인 포트폴리오 사이트. Cyberpunk HUD 테마의 React + Tailwind 프로젝트입니다.

## 저장소 구조

```
.
├── app/                 # 현재 서비스 중인 React 프로젝트 (여기서 작업)
├── portfolio.html       # 이전 버전(단일 HTML 파일) 백업 — 더 이상 수정하지 않음
└── docs/superpowers/    # 설계 스펙 / 구현 계획 기록
```

## 환경 요구사항

- **Node.js**: 20 이상 (개발 환경: v24.9.0)
- **npm**: 10 이상 (개발 환경: 11.6.0)
- 별도 환경변수(`.env`)나 API 키 필요 없음 — 정적 사이트

## 시작하기

```bash
git clone https://github.com/misosos/portfolio.git
cd portfolio/app
npm install
```

## 스크립트

`app/` 폴더에서 실행합니다.

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 (기본 포트 5173) |
| `npm run build` | 타입체크(`tsc -b`) + 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과물 로컬 미리보기 |
| `npm test` | Vitest 테스트 전체 실행 |
| `npm run lint` | Oxlint 실행 |

## 배포 전 체크리스트

```bash
cd app
npm test && npm run build
```

두 명령 모두 에러 없이 통과해야 합니다.

## 기술 스택

- **빌드**: Vite
- **프레임워크**: React 19 + TypeScript
- **스타일**: Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui 패턴 컴포넌트(Button/Badge)
- **애니메이션**: [motion](https://motion.dev) (Framer Motion), Three.js (히어로 네트워크 배경)
- **테스트**: Vitest + React Testing Library (jsdom)

## 디자인 토큰

`app/src/index.css`의 `@theme` 블록에 정의되어 있습니다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-bg` | `#0A0A0F` | 배경 |
| `--color-card` | `#12121A` | 카드/패널 |
| `--color-fg` | `#E0E0E0` | 기본 텍스트 |
| `--color-accent` | `#00FF88` | 주요 포인트(네온 그린) |
| `--color-accent-2` | `#FF00FF` | 보조 포인트(마젠타) |
| `--color-accent-3` | `#00D4FF` | 보조 포인트(시안) |
| `--font-heading` / `--font-mono` | JetBrains Mono | 전체 타이포그래피 |

모서리는 둥근 처리 대신 `.chamfer`(45도 챔퍼) 유틸리티를 사용합니다.

## 접근성

모든 모션/인터랙션 효과는 `useMotionPrefs()` 훅(`app/src/lib/motion-prefs.ts`)을 통해 `prefers-reduced-motion`과 포인터 타입(`hover: hover` / `pointer: fine`)에 따라 자동으로 켜지거나 꺼집니다.
