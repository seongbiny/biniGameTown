# Biniverse 아키텍처

## 개요

Biniverse는 Pixi.js 기반 미니게임들을 하나의 웹 플랫폼에서 제공하는 모노레포 프로젝트다.

```
biniverse/
├── apps/web          # React 웹 포털 (게임 탐색 및 실행)
├── games/            # 각 게임 패키지 (Pixi.js)
│   ├── typo-trap/
│   ├── flappy-bird/
│   └── bini-puzzle/
└── packages/
    └── game-sdk/     # 공유 타입 및 게임 레지스트리
```

> `packages/types`, `packages/ui`, `packages/utils`는 Phase 1 MVP 범위에서 보류.
> 공유 타입은 `packages/game-sdk/src/types.ts`에서 관리한다.

---

## 왜 모노레포인가?

- **타입 공유**: `GameMeta`, `GameInstance` 등을 로컬에서 직접 참조하며 npm 배포 없이 타입 안전성을 유지한다.
- **의존성 일괄 관리**: pnpm workspace로 중복 설치를 줄이고 Turborepo로 변경된 패키지만 빌드한다.
- **게임 확장**: `games/` 아래에 새 패키지를 추가하고 `GameModule`을 export하면 웹 포털에서 바로 인식된다.

---

## apps/web

React 19 + Vite 기반 웹 포털. 사용자가 게임을 탐색하고 실행하는 진입점이다.

라우트 구조:

```
/               → 홈 화면
/games          → 게임 목록
/games/:id      → 게임 상세
/games/:id/play → 게임 실행
```

### 게임 등록 흐름

`apps/web/src/gameModules.ts`에서 게임 패키지를 import해 배열로 구성하고,
`main.tsx`에서 렌더링 전에 `registerGames(modules)`를 호출해 레지스트리에 등록한다.

```ts
// apps/web/src/main.tsx
import { registerGames } from '@biniverse/game-sdk';
import gameModules from './gameModules';

registerGames(gameModules);
createRoot(rootElement).render(<App />);
```

### GamePlayer 컴포넌트

게임 실행 화면(`/games/:id/play`)에 마운트되며 `useEffect`로 게임 생명주기를 관리한다.

```ts
useEffect(() => {
  let instance: GameInstance | null = null;
  const start = async () => {
    instance = module.createGame();
    await instance.init(container);
    instance.start();
  };
  void start();
  return () => { instance?.destroy(); };  // cleanup: 페이지 이탈 시 리소스 해제
}, [gameId]);
```

---

## games/\*

각 게임은 독립 패키지로 존재하며, `GameModule` 인터페이스를 default export한다.

```
games/typo-trap/
├── src/
│   ├── index.ts          # GameModule export (진입점)
│   └── game/             # Pixi.js 게임 구현 (외부 비공개)
├── package.json
└── tsconfig.json
```

- 빌드 도구: `tsc` (타입 선언 생성용). Vite는 사용하지 않는다.
- 번들링은 `apps/web`의 Vite가 담당한다.
- `init / start / destroy` 외의 내부 구현은 외부에 노출되지 않는다.

---

## packages/game-sdk

게임과 웹 포털 사이의 공통 인터페이스와 레지스트리를 제공하는 순수 TypeScript 패키지.
React에 의존하지 않는다.

### 타입 (`src/types.ts`)

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

### 레지스트리 (`src/registry.ts`)

싱글톤 없이 배열 + 순수 함수로 구성한다.

```ts
const games: GameModule[] = [];

export function registerGames(modules: GameModule[]): void
export function getGameById(id: string): GameModule | undefined
export function getAllGames(): GameModule[]
```

---

## 게임 실행 흐름

사용자가 게임 실행 화면에 진입했을 때의 전체 흐름:

```
URL 진입 (/games/typo-trap/play)
  → getGameById('typo-trap')        → GameModule 반환
  → module.createGame()             → GameInstance 생성
  → instance.init(containerElement) → Pixi.js Application 초기화, canvas 삽입
  → instance.start()                → Ready 화면 표시, 게임 루프 시작
  → [사용자 플레이]
  → 페이지 이탈 (React useEffect cleanup)
  → instance.destroy()              → Pixi.js 리소스 해제, 이벤트 리스너 제거
```

---

## 게임 이식 순서

기존 완성된 게임을 `GameModule` 형태로 이식할 때 따르는 패턴:

1. `games/{game-name}/` 패키지 초기화 (`package.json`, `tsconfig.json`)
2. 기존 소스를 `src/game/` 아래로 복사
3. `init(container)` — Pixi.js Application 초기화 및 canvas 삽입
4. `start()` — Ready 화면 표시 (init과 분리)
5. `destroy()` — ticker 정지, 이벤트 리스너 제거, app.destroy(true)
6. `src/index.ts`에서 `GameModule`로 export
7. `apps/web/src/gameModules.ts`에 등록

주의 사항:

- `tsconfig.base.json`의 `noUncheckedIndexedAccess: true` — 배열 직접 인덱스 접근에 `!` 필요
- `exactOptionalPropertyTypes: true` — Pixi.js의 `Text` 스타일은 `TextStyleOptions` 타입 사용
- 로컬 `GameInstance` 인터페이스 제거 — `@biniverse/game-sdk`에서 import

---

## 기술 스택

| 영역      | 기술                           |
| --------- | ------------------------------ |
| 모노레포  | pnpm Workspace + Turborepo     |
| 웹 포털   | React 19 + Vite + Tailwind CSS |
| 게임 엔진 | Pixi.js 8                      |
| 배포      | Vercel                         |
| 언어      | TypeScript 5                   |
