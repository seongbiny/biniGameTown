# Game SDK

`@biniverse/game-sdk`는 게임 패키지와 웹 포털이 공유하는 타입과 레지스트리를 제공하는 순수 TypeScript 패키지다.
React에 의존하지 않으며, 모든 게임 패키지(`games/*`)와 웹 포털(`apps/web`)에서 참조한다.

---

## 인터페이스

### GameMeta

게임의 정적 메타데이터. 목록/상세 화면 렌더링에 사용한다.

```ts
export interface GameMeta {
  id: string;          // 고유 식별자 (예: 'typo-trap')
  title: string;       // 표시 이름
  description: string; // 게임 설명
  categories: string[]; // 카테고리 태그 (예: ['아케이드', '타이핑'])
  thumbnail: string;   // 썸네일 이미지 경로 (apps/web/public 기준)
  controls: string[];  // 조작법 설명 배열
}
```

### GameInstance

게임 인스턴스의 생명주기 인터페이스. 각 게임 클래스가 구현한다.

```ts
export interface GameInstance {
  init: (container: HTMLElement) => Promise<void>;
  start: () => void;
  destroy: () => void;
  pause?: () => void;   // 선택적
  resume?: () => void;  // 선택적
}
```

| 메서드 | 역할 |
| ------ | ---- |
| `init(container)` | Pixi.js Application 초기화, canvas를 container에 삽입 |
| `start()` | Ready 화면 표시, 게임 루프 시작 |
| `destroy()` | Ticker 정지, 이벤트 리스너 제거, Pixi.js 리소스 해제 |

### GameModule

게임 패키지의 export 형태. `meta`와 `createGame` 팩토리 함수로 구성된다.

```ts
export interface GameModule {
  meta: GameMeta;
  createGame: () => GameInstance;
}
```

---

## 레지스트리 함수

```ts
import { registerGames, getGameById, getAllGames } from '@biniverse/game-sdk';
```

| 함수 | 설명 |
| ---- | ---- |
| `registerGames(modules)` | 게임 모듈 배열을 레지스트리에 등록. `main.tsx`에서 한 번 호출 |
| `getGameById(id)` | id로 게임 모듈 조회. 없으면 `undefined` 반환 |
| `getAllGames()` | 등록된 모든 게임 모듈 배열 반환 |

---

## 새 게임 추가 방법

### 1. 패키지 초기화

`games/{game-name}/package.json`:

```json
{
  "name": "@biniverse/{game-name}",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" }
  },
  "scripts": { "build": "tsc" },
  "dependencies": {
    "@biniverse/game-sdk": "workspace:*",
    "pixi.js": "^8.0.0"
  }
}
```

`games/{game-name}/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

### 2. 게임 클래스 구현

`GameInstance` 인터페이스를 구현하는 클래스를 작성한다.

```ts
import type { GameInstance } from '@biniverse/game-sdk';
import { Application } from 'pixi.js';

export class MyGame implements GameInstance {
  private app!: Application;

  async init(container: HTMLElement): Promise<void> {
    this.app = new Application();
    await this.app.init({ width: 800, height: 600 });
    container.appendChild(this.app.canvas);
    // 씬, 이벤트 등 초기화
  }

  start(): void {
    // Ready 화면 표시
  }

  destroy(): void {
    this.app.destroy(true);
  }
}
```

`init()`과 `start()`를 반드시 분리한다. `GamePlayer`가 `await init()` 후 `start()`를 호출하기 때문이다.

### 3. GameModule export

`games/{game-name}/src/index.ts`:

```ts
import type { GameModule } from '@biniverse/game-sdk';
import { MyGame } from './game/MyGame';

const mygame: GameModule = {
  meta: {
    id: 'my-game',
    title: 'My Game',
    description: '게임 설명',
    categories: ['아케이드'],
    thumbnail: '/thumbnails/my-game.svg',
    controls: ['클릭으로 조작'],
  },
  createGame: () => new MyGame(),
};

export default mygame;
```

### 4. 웹 포털 등록

`apps/web/package.json`에 의존성 추가:

```json
"@biniverse/my-game": "workspace:*"
```

`apps/web/src/gameModules.ts`에 import:

```ts
import mygame from '@biniverse/my-game';

const gameModules: GameModule[] = [..., mygame];
```

썸네일 이미지를 `apps/web/public/thumbnails/my-game.svg`에 추가하고 `pnpm install` 실행.

---

## 자주 발생하는 타입 에러

### noUncheckedIndexedAccess

`tsconfig.base.json`에 `noUncheckedIndexedAccess: true`가 설정되어 있다.
배열 직접 인덱스 접근 시 반환 타입이 `T | undefined`가 되므로 `!`로 단언이 필요하다.

```ts
// ❌ 에러
const item = array[0];  // Type: T | undefined

// ✅ 수정
const item = array[0]!; // Type: T
```

### exactOptionalPropertyTypes + Pixi.js Text

`exactOptionalPropertyTypes: true` 설정에서 `TextStyle` 클래스를 스타일 파라미터로 사용하면 타입 에러가 발생한다.
`TextStyleOptions` 인터페이스를 사용한다.

```ts
// ❌ 에러
import { Text, TextStyle } from 'pixi.js';
function createText(style?: Partial<TextStyle>): Text { ... }

// ✅ 수정
import { Text, type TextStyleOptions } from 'pixi.js';
function createText(style?: Partial<TextStyleOptions>): Text { ... }
```

---

> **Phase 2 예정**: 게임 종료 시 점수를 Supabase로 전송하는 `submitGameResult` API가 추가될 예정이다.
> postMessage 기반 프로토콜은 Phase 2에서 설계한다.
