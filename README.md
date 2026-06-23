# Biniverse

Pixi.js 미니게임들을 하나의 웹 플랫폼에서 즐길 수 있는 게임 포털.

pnpm 모노레포 구조로 게임, 웹 포털, 공유 SDK를 하나의 저장소에서 관리한다.

## 게임 목록

| 게임        | 설명                                             |
| ----------- | ------------------------------------------------ |
| Typo Trap   | 화면에 나타나는 단어 중 오타가 있는 것을 찾아라! |
| Flappy Bird | 장애물을 피해 최대한 멀리 날아가라!              |
| Bini Puzzle | 숫자 타일을 순서대로 맞춰 퍼즐을 완성하라!       |

## 시작하기

### 사전 조건

- Node.js 20 이상
- pnpm 9 이상

```bash
# pnpm 설치 (없을 경우)
npm install -g pnpm
```

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/seongbiny/biniverse.git
cd biniverse

# 의존성 설치
pnpm install

# 개발 서버 실행 (웹 포털 + 게임 패키지 빌드)
pnpm dev
```

브라우저에서 `http://localhost:5173` 접속.

### 주요 명령어

```bash
pnpm dev          # 전체 개발 서버 실행
pnpm build        # 전체 빌드
pnpm typecheck    # 전체 타입 검사
pnpm lint         # 전체 lint
pnpm format       # Prettier 포맷팅
```

특정 패키지만 빌드:

```bash
pnpm --filter @biniverse/game-sdk build
pnpm --filter @biniverse/typo-trap build
pnpm --filter web dev
```

## 구조

```
biniverse/
├── apps/
│   └── web/              # React 웹 포털 (Vite + Tailwind CSS)
├── games/
│   ├── typo-trap/        # 타이핑 게임 (Pixi.js)
│   ├── flappy-bird/      # 비행 게임 (Pixi.js + Matter.js)
│   └── bini-puzzle/      # 퍼즐 게임 (Pixi.js)
├── packages/
│   └── game-sdk/         # 공유 타입 및 게임 레지스트리
└── docs/                 # 프로젝트 문서
```

## 새 게임 추가 방법

1. `games/{game-name}/` 디렉토리에 패키지 초기화
2. `GameInstance` 인터페이스(`init / start / destroy`)를 구현하는 게임 클래스 작성
3. `src/index.ts`에서 `GameModule`로 export
4. `apps/web/src/gameModules.ts`에 등록

자세한 내용은 [Game SDK 문서](docs/game-sdk.md) 참고.

## 기술 스택

| 영역      | 기술                           |
| --------- | ------------------------------ |
| 모노레포  | pnpm Workspace + Turborepo     |
| 웹 포털   | React 19 + Vite + Tailwind CSS |
| 게임 엔진 | Pixi.js 8                      |
| 배포      | Vercel                         |
| 언어      | TypeScript 5                   |

## 문서

- [아키텍처](docs/architecture.md) — 패키지 구조 및 게임 실행 흐름
- [Game SDK](docs/game-sdk.md) — 게임 추가 방법 및 인터페이스 명세
- [로드맵](docs/roadmap.md) — 개발 단계별 계획
- [학습 기록](docs/learning-log.md) — 구현 중 배운 점
