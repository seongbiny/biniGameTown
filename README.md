# BINIVERSE

미니게임 포털. 직접 만든 게임들을 한 곳에서 즐길 수 있는 웹사이트.

## 게임 목록

| 게임 | 설명 |
|------|------|
| **BINI PUZZLE** | 퍼즐 조각을 맞추는 슬라이딩 퍼즐 게임 |
| **FLAPPY PLANE** | 장애물을 피해 비행기를 조종하는 게임 |
| **TYPO TRAP** | 틀린 글자를 찾아내는 타이핑 게임 |

## 기술 스택

- **웹**: React 19 + Vite 6 + Tailwind CSS 4 + React Router v7
- **게임**: Pixi.js 8
- **백엔드**: Supabase (인증 + 점수 저장)
- **배포**: Vercel
- **모노레포**: pnpm Workspace

## 개발 환경 설정

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

루트에 `.env.local` 파일 생성:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

| 서버 | 주소 |
|------|------|
| 웹 포털 | http://localhost:3000 |
| bini-puzzle | http://localhost:5001 |
| flappy-plane | http://localhost:5002 |
| typo-trap | http://localhost:5003 |

> 브라우저 URL은 `localhost:3000/game/flappy-plane` 형태로 유지됨.
> 게임은 해당 페이지 내 iframe에서 `localhost:5002`로 로드됨.

## 빌드 및 배포

```bash
pnpm build   # 게임 빌드 → 웹 빌드 순서로 실행
```

빌드 결과물은 `dist/`에 생성되며 Vercel에서 자동 배포됨.

## 테스트

```bash
pnpm test:e2e      # Playwright e2e 테스트
pnpm test:e2e:ui   # UI 모드로 테스트
```

## 새 게임 추가하기

1. `packages/shared/src/gameRecordService.ts` — `GameId` 타입에 새 ID 추가
2. `packages/web/src/config/games.ts` — `gamesById`에 메타 정보 추가
3. `vercel.json` — rewrites에 경로 추가
4. 루트 `package.json` — dev 스크립트 + prebuild에 추가
5. `packages/game/new-game/` — 게임 패키지 생성

자세한 내용은 [CLAUDE.md](./CLAUDE.md) 참고.
