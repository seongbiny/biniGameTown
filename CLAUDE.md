# CLAUDE.md

Claude Code가 이 저장소에서 작업할 때 참조하는 가이드.

## 프로젝트 개요

Biniverse는 Pixi.js 미니게임들을 하나의 웹 플랫폼에서 제공하는 pnpm 모노레포다.

## 패키지 구조

```
apps/
  web/              # React 웹 포털
games/
  typo-trap/        # 타이핑 게임 (Pixi.js)
  flappy-bird/      # 비행기 게임 (Pixi.js)
  bini-puzzle/      # 퍼즐 게임 (Pixi.js)
packages/
  game-sdk/         # 게임 ↔ 웹 통신 SDK
  types/            # 공유 TypeScript 타입
  ui/               # 공유 UI 컴포넌트
  utils/            # 공유 유틸리티
docs/               # 프로젝트 문서
```

## 주요 명령어

```bash
pnpm dev          # 전체 개발 서버 실행
pnpm build        # 전체 빌드
pnpm lint         # 전체 lint
pnpm typecheck    # 전체 타입 검사
pnpm format       # Prettier 포맷팅
```

## 기술 스택

| 영역      | 기술                           |
| --------- | ------------------------------ |
| 모노레포  | pnpm Workspace + Turborepo     |
| 웹 포털   | React 19 + Vite + Tailwind CSS |
| 게임 엔진 | Pixi.js 8                      |
| 백엔드    | Supabase                       |
| 배포      | Vercel                         |
| 언어      | TypeScript 5                   |

## 코딩 규칙

- **응답/문서 언어**: 한국어
- **변수/함수명**: 영어 (코드 표준)
- **들여쓰기**: 2칸
- **네이밍**: camelCase, PascalCase (컴포넌트)
- **`any` 타입 사용 금지**
- 컴포넌트 분리 및 재사용 우선
- 반응형 필수

## 환경변수

루트 `.env.local`에 위치:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## 게임-웹 통신

게임은 `@biniverse/game-sdk`의 `submitGameResult`를 통해 결과를 전송한다.
프로토콜 상세는 `docs/game-sdk.md` 참고.

## 아키텍처 상세

`docs/architecture.md` 참고.

## 학습 중심 작업 규칙

이 프로젝트는 포트폴리오 목적뿐 아니라 학습 목적도 있다.

Claude Code는 기본적으로 코드를 직접 수정하지 말고, 먼저 단계별 안내를 제공한다.

사용자가 명시적으로 "직접 수정해줘"라고 말하기 전까지는 파일을 생성하거나 수정하지 않는다.

각 단계에서는 아래 내용을 설명한다.

- 이 작업의 목적
- 왜 필요한지
- 생성/수정할 파일
- 작성할 코드
- 코드가 하는 일
- 확인 방법
- 자주 발생하는 에러

사용자가 직접 구현한 뒤에는 코드 리뷰와 개선 방향을 제안한다.
