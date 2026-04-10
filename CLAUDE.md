# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# BINIVERSE

pnpm workspace 기반 모노레포. React 웹앱(포털)이 Pixi.js 게임 3개를 iframe으로 호스팅한다.

## 기술 스택

- **모노레포**: pnpm Workspace (packageManager: pnpm@9.15.4)
- **웹**: React 19 + Vite 6 + Tailwind CSS 4 + Zustand + React Router v7
- **게임 엔진**: Pixi.js 8
- **백엔드**: Supabase (auth + scores 테이블)
- **배포**: Vercel
- **테스트**: Playwright (e2e/)

## 패키지 구조

```
packages/
├── web/              # React 웹 포털 (dev: 3000)
├── shared/           # Supabase 클라이언트 + submitGameResult 유틸리티
└── game/
    ├── bini-puzzle/  # 퍼즐 게임 (dev: 5001)
    ├── flappy-plane/ # 비행기 게임 (dev: 5002)
    └── typo-trap/    # 타이핑 게임 (dev: 5003)
```

## 주요 명령어

```bash
pnpm dev          # 모든 앱 동시 실행 (concurrently)
pnpm build        # 전체 빌드: 게임 먼저, 웹 나중
pnpm lint         # 전체 패키지 lint 병렬 실행
pnpm test:e2e     # Playwright e2e 테스트 실행
pnpm test:e2e:ui  # Playwright UI 모드로 테스트

pnpm dev:web      # 웹만 실행
pnpm dev:puzzle   # bini-puzzle만 실행
pnpm dev:flappy   # flappy-plane만 실행
pnpm dev:typo     # typo-trap만 실행
```

## 빌드 아키텍처

- 각 게임은 `dist/game/{game-name}/`에 빌드됨 (vite.config.ts의 `outDir` 참고)
- 웹 빌드가 해당 경로를 `/game/{game-name}/`으로 서빙
- `prebuild` 스크립트가 출력 디렉토리를 미리 생성함

## 게임-웹 통신 프로토콜

모든 게임에서 점수 전송 시 `@bini-game-town/shared`의 `submitGameResult`를 사용:

```ts
import { submitGameResult } from '@bini-game-town/shared';
submitGameResult('flappy-plane', score, 'normal');
```

내부적으로 `window.parent.postMessage({ type: 'BGT_GAME_RESULT', payload: { gameName, score, difficulty } }, '*')` 형태로 전송.

웹의 `GamePage.tsx`가 메시지를 수신하여 Supabase `scores` 테이블에 저장. 로그인 상태가 아닐 경우 저장하지 않음.

**개발 환경**: 게임은 각자 다른 포트(origin)에서 실행되므로 allowedOrigins가 gamesById config에서 자동 생성됨.
**프로덕션**: 동일 origin에서 서빙되므로 `window.location.origin`만 허용.

## 게임 config 아키텍처 (단일 소스)

`GameId` 타입의 단일 소스는 `packages/shared/src/gameRecordService.ts`:

```ts
export type GameId = "typo-trap" | "flappy-plane" | "bini-puzzle";
```

`packages/web/src/config/games.ts`의 `gamesById`가 모든 게임 메타데이터를 관리:

```ts
export interface GameMeta {
  id: GameId;
  title: string;    // 패널 타이틀 (예: "BINI PUZZLE")
  description: string;
  panelImage: string;
  icon: string;
  logo: string;     // 게임 목록 로고 이미지
  devPort: number;  // 개발 서버 포트 (예: 5001)
}
```

`MainPage`, `RankingPage`, `GamePage`는 모두 `gamesById`에서 동적으로 렌더링되므로
**새 게임 추가 시 hardcoding 없이 config만 수정**하면 됨.

## 새 게임 추가 방법

새 게임 `new-game`을 추가할 때 수정할 파일:

1. **`packages/shared/src/gameRecordService.ts`** — `GameId` 타입에 `"new-game"` 추가
2. **`packages/web/src/config/games.ts`** — `gamesById`에 메타 정보 추가 (logo SVG, devPort 포함)
3. **`vercel.json`** — rewrites에 `/game/new-game/:path*` 경로 추가
4. **루트 `package.json`** — `prebuild`의 mkdir + `dev` 스크립트에 추가
5. **`packages/game/new-game/`** — 게임 패키지 생성 (vite.config.ts에 `envDir: resolve(__dirname, '../../../')` 필수)

## 게임 공통 아키텍처 (Pixi.js)

각 게임은 `SceneController` 싱글톤 패턴 사용:

```
SceneController (싱글톤) → Pixi.js Ticker로 게임 루프 관리
  └── sceneMap: Map<SceneType, Scene>
       ├── READY → ReadyScene
       ├── PLAYING → PlayingScene
       └── GAMEOVER/RESULT → GameOverScene/ResultScene
```

씬 생명주기: `initialize()` → `resume()` → (반복) `update(deltaTime)` → `pause()` → `reset()`

씬 전환 시 기존 씬은 `pause()` 후 stage에서 제거, 새 씬은 미초기화 시 `initialize()`, 재방문 시 `reset()` 후 `resume()`.

## shared 패키지 exports

```ts
import { supabase } from '@bini-game-town/shared';        // Supabase 클라이언트
import { submitGameResult } from '@bini-game-town/shared'; // 게임 결과 전송 (postMessage)
import type { GameId, GameResultPayload } from '@bini-game-town/shared';
```

게임 패키지 내 `src/game/utils/supabaseClient.ts`는 shared를 re-export하는 래퍼.

## 웹 라우팅

```
/           → SplashPage
/sign-in    → SignInPage (Supabase OAuth)
/auth/callback → AuthCallback
/main       → MainPage (게임 선택)
/ranking    → RankingPage
/game/:gameName → GamePage (iframe 호스팅)
```

## 인증

Supabase Auth → Zustand `useAuthStore` (`session: Session | null`). `App.tsx`에서 `onAuthStateChange` 구독.

## 경로 별칭

- 웹: `@/` → `packages/web/src/`
- 게임 ID 타입: `packages/shared/src/gameRecordService.ts`의 `GameId` (단일 소스)

## 환경변수

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

`.env.local`은 **모노레포 루트**에 위치. 모든 패키지(web + 각 게임)의 `vite.config.ts`에
`envDir: resolve(__dirname, '../../')` 또는 `envDir: resolve(__dirname, '../../../')`로 설정되어 있음.
