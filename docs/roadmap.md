# Biniverse 개발 로드맵

> **최종 업데이트**: 2026-06-23
> **버전**: v1.2.0
> **현재 단계**: Phase 1 진행 중

---

## 전체 개발 단계 개요

| Phase | 이름 | 상태 | 목표 |
|-------|------|------|------|
| Phase 1 | MVP — 게임 포털 기반 구축 | 🟡 진행 중 | Typo Trap을 시작으로 미니게임을 한 곳에서 탐색하고 실행 |
| Phase 2 | 랭킹 시스템 | 🔜 대기 | Supabase + 소셜 로그인 + 점수 저장 |
| Phase 3 | 성능 최적화 | 🔜 대기 | Lazy loading 고도화, Lighthouse 개선, 메모리 누수 점검 |
| Phase 4 | 모바일 앱 | 🔜 대기 | React Native / Expo, WebView 기반 게임 플레이 |
| Phase 5 | 어드민 | 🔜 대기 | 게임 관리, 랭킹 데이터 조회, 공지 관리 |

---

## Phase 1: MVP — 게임 포털 기반 구축

**목표**: `pnpm dev` 한 번으로 웹사이트가 실행되고, 사용자가 Typo Trap을 우선 탐색·실행할 수 있다. 이후 Flappy Bird, Bini Puzzle을 순차적으로 이식한다.
**예상 기간**: 3~4주
**포함 게임**: Typo Trap (1차), Flappy Bird, Bini Puzzle (2차)

---

### 1-1. 모노레포 초기 세팅

- [ ] **[TASK-001]** `pnpm-workspace.yaml` 구성 확인 및 `apps/`, `games/`, `packages/` 경로 등록
  - 담당 파일: `pnpm-workspace.yaml`, `turbo.json`
  - 완료 기준: `pnpm dev` 실행 시 모든 워크스페이스 패키지가 인식된다
- [ ] **[TASK-002]** Turborepo 파이프라인 정의 (`dev`, `build`, `lint`, `typecheck`)
  - 담당 파일: `turbo.json`
  - 완료 기준: `pnpm build` 실행 시 의존성 순서에 맞게 빌드가 진행된다
- [ ] **[TASK-003]** 공통 `tsconfig.base.json` 설정 및 각 패키지에서 extends
  - 담당 파일: `tsconfig.base.json`
  - 완료 기준: 루트 `pnpm typecheck`가 에러 없이 통과한다
- [ ] **[TASK-004]** ESLint + Prettier 공통 설정 완성
  - 담당 파일: `eslint.config.js`, `prettier.config.js`
  - 완료 기준: `pnpm lint`, `pnpm format`이 정상 동작한다
- [ ] **[TASK-005]** `.gitignore` 정비 (`node_modules`, `dist`, `.env*` 등)
  - 완료 기준: 불필요한 파일이 git에 추적되지 않는다

---

### 1-2. `packages/game-sdk` 구현

> `packages/game-sdk`는 React에 의존하지 않는 순수 TypeScript 패키지다.
> 게임과 웹 포털 간의 공유 타입 및 레지스트리 로직을 담는다.
> postMessage 기반 프로토콜은 Phase 2 (랭킹 시스템) 이후로 보류한다.

- [ ] **[TASK-006]** `packages/game-sdk` 패키지 초기화 (`package.json`, `tsconfig.json`)
  - 담당 파일: `packages/game-sdk/`
  - 완료 기준: `pnpm --filter @biniverse/game-sdk build`가 성공한다
- [ ] **[TASK-007]** 공유 타입 정의 — `GameMeta`, `GameInstance`, `GameModule`
  ```ts
  export interface GameMeta {
    id: string;
    title: string;
    description: string;
    categories: string[];
    thumbnail: string;
    controls: string[];
  }

  export interface GameInstance {
    init: (container: HTMLElement) => Promise<void>;
    start: () => void;
    destroy: () => void;
    pause?: () => void;
    resume?: () => void;
  }

  export interface GameModule {
    meta: GameMeta;
    createGame: () => GameInstance;
  }
  ```
  - 담당 파일: `packages/game-sdk/src/types.ts`
  - 완료 기준: 다른 패키지에서 `@biniverse/game-sdk`로 import된다
- [ ] **[TASK-008]** `GameRegistry` 구현 — 게임 등록 및 조회
  - 담당 파일: `packages/game-sdk/src/registry.ts`
  - 상세: `GameModule[]` 배열로 게임 목록을 관리하고 `getGameById(id: string)` 함수로 조회 — 싱글톤 없이 배열 + 순수 함수로 단순하게 구성
  - 완료 기준: `getGameById('typo-trap')`이 해당 `GameModule`을 반환한다

---

### 1-3. `apps/web` 구현

#### 1-3-1. 프로젝트 초기화

- [ ] **[TASK-009]** Vite + React + TypeScript 프로젝트 생성
  - 담당 파일: `apps/web/`
  - 완료 기준: `pnpm --filter web dev` 실행 시 개발 서버가 뜬다
- [ ] **[TASK-010]** Tailwind CSS 설정
  - 담당 파일: `apps/web/tailwind.config.ts`, `apps/web/src/index.css`
  - 완료 기준: Tailwind 유틸리티 클래스가 화면에 적용된다
- [ ] **[TASK-011]** React Router 설치 및 라우팅 구조 설계
  - 담당 파일: `apps/web/src/router.tsx`
  - 라우트 구조:
    - `/` — 홈 화면
    - `/games` — 게임 목록
    - `/games/:id` — 게임 상세
    - `/games/:id/play` — 게임 실행
  - 완료 기준: 각 경로로 직접 접근 시 해당 화면이 렌더링된다

#### 1-3-2. 레이아웃 및 공통 컴포넌트

- [ ] **[TASK-012]** `Layout` 컴포넌트 구현 — 헤더, 네비게이션, 푸터
  - 담당 파일: `apps/web/src/components/layout/`
  - 완료 기준: 모든 페이지에 공통 레이아웃이 적용된다
- [ ] **[TASK-013]** `GameCard` 컴포넌트 구현 — 썸네일, 제목, 카테고리 표시
  - 담당 파일: `apps/web/src/components/game/GameCard.tsx`
  - 완료 기준: `GameMeta`를 props로 받아 카드 UI를 렌더링한다
- [ ] **[TASK-014]** 반응형 그리드 레이아웃 구현 (모바일 1열, 태블릿 2열, 데스크탑 3열)
  - 담당 파일: `apps/web/src/components/game/GameGrid.tsx`
  - 완료 기준: 화면 크기에 따라 카드 열 수가 조정된다

#### 1-3-3. 화면 구현

- [ ] **[TASK-015]** 홈 화면 (`/`) 구현
  - 담당 파일: `apps/web/src/pages/HomePage.tsx`
  - 상세: 플랫폼 소개 문구, 주요 게임 카드 노출, 게임 목록 진입 CTA 버튼
  - 완료 기준: 홈 화면이 렌더링되고 게임 목록 링크가 동작한다
- [ ] **[TASK-016]** 게임 목록 화면 (`/games`) 구현
  - 담당 파일: `apps/web/src/pages/GamesPage.tsx`
  - 상세: `GameRegistry`에서 전체 게임 목록을 읽어 `GameCard` 그리드로 렌더링
  - 완료 기준: 게임 카드가 표시되고 각 카드 클릭 시 상세 화면으로 이동한다
- [ ] **[TASK-017]** 게임 상세 화면 (`/games/:id`) 구현
  - 담당 파일: `apps/web/src/pages/GameDetailPage.tsx`
  - 상세: 썸네일, 제목, 설명, 조작법, 게임 실행 버튼 표시
  - 완료 기준: URL의 `id`에 해당하는 게임 정보가 표시되고 실행 버튼이 동작한다
- [ ] **[TASK-018]** 게임 실행 화면 (`/games/:id/play`) 구현
  - 담당 파일: `apps/web/src/pages/GamePlayPage.tsx`
  - 상세: `GamePlayer` 컴포넌트를 마운트하고 페이지 이탈 시 `destroy()` 호출
  - 완료 기준: 게임 캔버스가 정상 렌더링되고 뒤로 가기 시 Pixi.js 리소스가 해제된다

#### 1-3-4. 게임 데이터 구성

- [ ] **[TASK-019]** `GameModule` 등록 파일 작성
  - 담당 파일: `apps/web/src/gameModules.ts`
  - 상세: 각 게임 패키지에서 `GameModule`을 import하여 배열로 등록 — `GameMeta`는 각 `GameModule.meta`에 내장되므로 별도 메타데이터 파일 불필요
  - 완료 기준: 등록된 `GameModule` 목록을 `getGameById`로 조회할 수 있다
- [ ] **[TASK-020]** 썸네일 이미지 에셋 준비
  - 담당 파일: `apps/web/public/thumbnails/`
  - 완료 기준: 게임 썸네일이 목록/상세 화면에 표시된다

#### 1-3-5. `GamePlayer` 컴포넌트

- [ ] **[TASK-021]** `GamePlayer` React 컴포넌트 구현
  - 담당 파일: `apps/web/src/components/game/GamePlayer.tsx`
  - 상세:
    - `gameId`를 prop으로 받아 `GameRegistry`에서 `GameModule` 조회
    - `useEffect`에서 `init(container) → start()` 실행
    - cleanup 함수에서 `destroy()` 호출
    - 로딩 중 스피너, 에러 상태 처리
  - 완료 기준: 게임이 마운트/언마운트 시 생명주기가 올바르게 호출된다

---

### 1-4. 게임 이식

> 기존 완성된 게임을 `GameModule` 인터페이스에 맞게 래핑한다.
> **Typo Trap을 1차 목표로 우선 이식**하여 전체 파이프라인(패키지 초기화 → 소스 이식 → GameModule 등록 → 실행 확인)을 검증한다.
> 파이프라인이 검증되면 동일한 방식으로 Flappy Bird, Bini Puzzle을 순차적으로 이식한다.

#### 1차: Typo Trap

- [ ] **[TASK-022]** `games/typo-trap` 패키지 초기화 (`package.json`, `tsconfig.json`, `vite.config.ts`)
  - 완료 기준: `pnpm --filter @biniverse/typo-trap build`가 성공한다
- [ ] **[TASK-023]** 기존 Typo Trap 소스 이식
  - 담당 파일: `games/typo-trap/src/`
  - 완료 기준: 기존 게임 로직이 Pixi.js 기준으로 동작한다
- [ ] **[TASK-024]** `GameModule` 형태로 export
  - 담당 파일: `games/typo-trap/src/index.ts`
  - 완료 기준: `createGame()`으로 생성한 인스턴스의 `init/start/destroy`가 정상 동작한다

#### 2차: Flappy Bird, Bini Puzzle (Typo Trap 완료 후 반복 적용)

- [ ] **[TASK-025]** `games/flappy-bird` 패키지 초기화
  - 완료 기준: `pnpm --filter @biniverse/flappy-bird build`가 성공한다
- [ ] **[TASK-026]** 기존 Flappy Bird 소스 이식
  - 담당 파일: `games/flappy-bird/src/`
  - 완료 기준: 기존 게임 로직이 Pixi.js 기준으로 동작한다
- [ ] **[TASK-027]** `GameModule` 형태로 export
  - 담당 파일: `games/flappy-bird/src/index.ts`
  - 완료 기준: `createGame()`으로 생성한 인스턴스의 `init/start/destroy`가 정상 동작한다
- [ ] **[TASK-028]** `games/bini-puzzle` 패키지 초기화
  - 완료 기준: `pnpm --filter @biniverse/bini-puzzle build`가 성공한다
- [ ] **[TASK-029]** 기존 Bini Puzzle 소스 이식
  - 담당 파일: `games/bini-puzzle/src/`
  - 완료 기준: 기존 게임 로직이 Pixi.js 기준으로 동작한다
- [ ] **[TASK-030]** `GameModule` 형태로 export
  - 담당 파일: `games/bini-puzzle/src/index.ts`
  - 완료 기준: `createGame()`으로 생성한 인스턴스의 `init/start/destroy`가 정상 동작한다

---

### 1-5. 문서화

- [ ] **[TASK-031]** `README.md` 작성 — 프로젝트 소개, 실행 방법, 구조 설명
  - 담당 파일: `README.md` (루트)
  - 완료 기준: 저장소를 처음 보는 사람이 `pnpm dev`까지 따라할 수 있다
- [ ] **[TASK-032]** `docs/architecture.md` 업데이트 — Phase 1 최종 아키텍처 반영
  - 상세: `GameModule` 직접 호출 방식으로 정확히 갱신
  - 완료 기준: 실제 구현과 문서가 일치한다
- [ ] **[TASK-033]** `docs/game-sdk.md` 업데이트 — `GameInstance` / `GameModule` 인터페이스 문서화
  - 완료 기준: 새 게임을 추가하는 개발자가 SDK 사용법을 이해할 수 있다
- [ ] **[TASK-034]** `docs/learning-log.md` 작성 — 학습 기록
  - 담당 파일: `docs/learning-log.md`
  - 상세: 각 태스크를 구현하면서 배운 점, 막혔던 지점, 해결 방법을 날짜별로 기록
  - 완료 기준: Phase 1 구현 중 의미 있는 학습 내용이 지속적으로 기록된다

---

## Phase 2: 랭킹 시스템

**목표**: 사용자가 로그인하고 게임 점수를 저장·조회할 수 있다.

- Supabase 프로젝트 연결 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- 소셜 로그인 (Google OAuth) 구현
- Supabase `scores` 테이블 스키마 설계 및 마이그레이션
- 게임 종료 시 점수 저장 연동 — postMessage 프로토콜 설계 및 구현
- 글로벌 랭킹 화면 구현 (게임별 Top 10)
- 내 기록 화면 구현

---

## Phase 3: 성능 최적화

**목표**: 로딩 속도와 런타임 성능을 개선하고 Lighthouse 점수를 높인다.

- 게임 패키지 lazy loading 고도화 (`React.lazy` + dynamic import)
- Pixi.js 텍스처 캐시 및 메모리 누수 점검
- 이미지 에셋 최적화 (WebP 변환, 크기 최적화)
- Lighthouse Performance 80점 이상 달성
- 번들 사이즈 분석 및 코드 스플리팅 적용

---

## Phase 4: 모바일 앱

**목표**: React Native / Expo 앱에서 WebView로 게임을 실행할 수 있다.

- Expo 프로젝트 초기화 (`apps/mobile/`)
- WebView 기반 게임 임베딩
- 모바일 터치 이벤트 → 게임 조작 매핑
- 앱스토어 / 플레이스토어 배포 파이프라인 구성

---

## Phase 5: 어드민

**목표**: 게임 콘텐츠와 사용자 데이터를 관리할 수 있는 어드민 화면을 제공한다.

- 어드민 인증 (역할 기반 접근 제어)
- 게임 메타데이터 관리 (추가/수정/비활성화)
- 랭킹 데이터 조회 및 초기화
- 공지 관리

---

## 기술 결정 사항

### GameModule 직접 호출 방식 (Phase 1)

PRD는 게임과 웹 포털이 `GameInstance` 인터페이스를 통해 직접 통신하는 방식을 채택했다. 이 방식을 Phase 1에서 사용하는 이유는 다음과 같다.

- **단순성**: iframe 샌드박싱과 postMessage 직렬화 없이 TypeScript 타입 안전성을 유지한다
- **생명주기 제어**: `init → start → destroy`를 React의 `useEffect` cleanup과 직접 연결할 수 있다
- **포트폴리오 목적**: Pixi.js canvas 생명주기 관리 역량을 직접 보여줄 수 있다

postMessage 프로토콜은 Phase 2 (랭킹 시스템) 단계에서 별도로 설계하고 구현한다.

### packages/game-sdk vs apps/web 역할 분리

| 패키지 | 역할 | React 의존 |
|--------|------|-----------|
| `packages/game-sdk` | 공유 타입(`GameMeta`, `GameInstance`, `GameModule`) + `GameRegistry` | 없음 (순수 TypeScript) |
| `apps/web` | `GamePlayer` React 컴포넌트 — `useEffect`로 게임 생명주기 관리 | 있음 |

`packages/types`는 Phase 1 MVP 범위에서 보류한다. 공유 타입은 `packages/game-sdk/src/types.ts`에서 관리하며, 별도 패키지 분리가 필요한 시점에 재검토한다.

### pnpm Workspace + Turborepo

- 패키지 간 로컬 의존성(`@biniverse/*`)을 심링크로 관리하여 개발 중 즉시 반영된다
- Turborepo 캐시로 변경된 패키지만 빌드하여 빌드 시간을 단축한다

### Vite + React

- HMR 속도가 빠르고 Pixi.js 에셋 번들링에 적합하다

### TypeScript `any` 타입 금지

`GameInstance`, `GameModule` 인터페이스를 통해 게임과 웹 포털 간 계약을 명시적으로 정의한다. `any` 사용 시 런타임 오류가 타입 검사 단계에서 잡히지 않는다.

---

## 성공 기준

### Phase 1A — Typo Trap 단독 실행 (중간 완료 기준)

> 전체 파이프라인이 end-to-end로 동작함을 처음 확인하는 단계. Flappy Bird·Bini Puzzle 이식 전에 여기서 먼저 멈추고 검증한다.

- [ ] `pnpm dev`로 웹사이트가 실행된다
- [ ] 홈 화면(`/`)이 표시된다
- [ ] 게임 목록 화면(`/games`)에서 Typo Trap 카드가 표시된다
- [ ] Typo Trap 상세 화면(`/games/typo-trap`)으로 이동할 수 있다
- [ ] Typo Trap 실행 화면(`/games/typo-trap/play`)에서 게임이 실행된다
- [ ] 실행 화면에서 벗어나면 Pixi.js 리소스가 정리된다 (`destroy()` 호출 확인)

### Phase 1B — 전체 게임 이식 완료 (Phase 1 최종 완료 조건)

- [ ] Flappy Bird, Bini Puzzle도 목록·상세·실행이 모두 동작한다
- [ ] 모바일 화면에서도 게임 목록 탐색과 게임 실행이 가능하다
- [ ] 브라우저 콘솔에 치명적인 에러가 없다
- [ ] `README.md`와 `docs/architecture.md`가 최신 상태로 작성되어 있다
- [ ] `docs/learning-log.md`에 Phase 1 학습 내용이 기록되어 있다

---

## 진행 추적

| Phase | 상태 | 시작일 | 완료일 | 비고 |
|-------|------|--------|--------|------|
| Phase 1 | 🟡 진행 중 | 2026-06-23 | - | 모노레포 뼈대 완료 |
| Phase 2 | 🔜 대기 | - | - | |
| Phase 3 | 🔜 대기 | - | - | |
| Phase 4 | 🔜 대기 | - | - | |
| Phase 5 | 🔜 대기 | - | - | |

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 2026-06-23 | v1.0.0 | 최초 작성 | Claude |
| 2026-06-23 | v1.1.0 | MVP 범위 조정 — GameDifficulty 제거, packages/types 보류, game-sdk 역할 명확화, postMessage Phase 2 보류, 게임 이식 순서 조정, learning-log 추가 | Claude |
| 2026-06-23 | v1.2.0 | GameModule.id 제거, GameRegistry를 배열+함수로 단순화, game-sdk에서 vite.config.ts 제거, games.ts를 gameModules.ts 등록 파일로 변경, React Concurrent 문구 제거, Phase 1A/1B 중간 완료 기준 추가 | Claude |
