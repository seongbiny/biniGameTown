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
└── packages/         # 공유 라이브러리
    ├── game-sdk/     # 게임 실행 인터페이스 및 레지스트리
    ├── types/        # 공유 TypeScript 타입
    ├── ui/           # 공유 UI 컴포넌트
    └── utils/        # 공유 유틸리티
```

---

## 왜 모노레포인가?

게임 패키지, 웹 포털, 공유 SDK가 서로 다른 패키지로 분리되어 있지만 하나의 저장소에서 함께 관리해야 하는 이유가 있다.

- **게임과 웹이 같은 타입을 공유한다**: `GameMeta`, `GameInstance` 등을 별도 npm 패키지로 배포하지 않고 로컬에서 바로 참조할 수 있다.
- **의존성을 일괄 관리한다**: pnpm workspace로 중복 설치를 줄이고, Turborepo로 변경된 패키지만 빌드한다.
- **게임 추가 확장이 쉽다**: 새 게임을 `games/` 아래에 추가하고 `GameModule`을 export하면 웹 포털에서 바로 인식된다.

---

## apps/web

React 19 + Vite 기반 웹 포털. 사용자가 게임을 탐색하고 실행하는 진입점이다.

- 홈 / 게임 목록 / 게임 상세 / 게임 실행 4개 화면을 제공한다.
- `GameRegistry`에서 게임 목록을 읽어 렌더링한다.
- `GamePlayer` 컴포넌트로 게임 생명주기를 관리한다.

라우트 구조:

```
/               → 홈 화면
/games          → 게임 목록
/games/:id      → 게임 상세
/games/:id/play → 게임 실행
```

---

## games/\*

각 게임은 독립 패키지로 존재하며, `GameModule` 인터페이스를 export한다.

- 게임 내부 구현(Pixi.js 로직)은 외부에 노출되지 않는다.
- `createGame()`으로 인스턴스를 생성하고 `init / start / destroy`로 제어한다.
- 웹 포털은 게임 구현을 알 필요 없이 인터페이스만 호출한다.

```
games/typo-trap/
├── src/
│   ├── index.ts    # GameModule export
│   └── ...         # Pixi.js 게임 구현
├── package.json
└── tsconfig.json
```

---

## packages/game-sdk

게임과 웹 포털 사이의 공통 인터페이스를 제공한다.

- **`GameRegistry`**: 게임 목록을 등록하고 id로 조회하는 싱글톤
- **`GamePlayer` 로직**: `init → start → destroy` 생명주기 관리

> Phase 2에서는 `submitGameResult` (점수 전송)가 추가될 예정이다.

---

## packages/types

프로젝트 전체에서 공유하는 TypeScript 타입을 정의한다.

```ts
export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface GameMeta {
  id: string;
  title: string;
  description: string;
  categories: string[];
  difficulty: GameDifficulty;
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
  id: string;
  meta: GameMeta;
  createGame: () => GameInstance;
}
```

`any` 타입을 금지하고 이 인터페이스로 게임과 웹 포털 사이의 타입 안전성을 보장한다.

---

## 게임 실행 흐름

사용자가 게임 실행 화면(`/games/:id/play`)에 진입하면 아래 순서로 실행된다.

```
URL 진입 (/games/typo-trap/play)
  → GameRegistry.getGame('typo-trap') → GameModule 반환
  → createGame()                       → GameInstance 생성
  → init(containerElement)             → Pixi.js Application 초기화
  → start()                            → 게임 루프 시작
  → [사용자 플레이]
  → 페이지 이탈 또는 컴포넌트 unmount
  → destroy()                          → Pixi.js 리소스 해제, 이벤트 리스너 제거
```

`GamePlayer` 컴포넌트는 `useEffect`의 cleanup 함수에서 `destroy()`를 호출해 메모리 누수를 방지한다.

---

## 게임 이식 순서

기존 완성된 게임을 `GameModule` 형태로 이식할 때 아래 순서를 따른다.

1. `games/{game-name}/` 패키지 초기화 (`package.json`, `tsconfig.json`, `vite.config.ts`)
2. 기존 게임 소스를 `src/` 아래로 이동
3. Pixi.js Application 생성/해제 코드를 `init()` / `destroy()`로 감싼다
4. 게임 루프 시작 코드를 `start()`로 감싼다
5. `src/index.ts`에서 `GameModule` 형태로 export한다
6. `GameRegistry`에 등록하고 `apps/web`에서 동작 확인

---

## 기술 스택

| 영역      | 기술                           |
| --------- | ------------------------------ |
| 모노레포  | pnpm Workspace + Turborepo     |
| 웹 포털   | React 19 + Vite + Tailwind CSS |
| 게임 엔진 | Pixi.js 8                      |
| 배포      | Vercel                         |
| 언어      | TypeScript 5                   |
