# Biniverse

Pixi.js 미니게임들을 하나의 웹 플랫폼에서 즐길 수 있는 게임 포털.

## 게임 목록

| 게임 | 설명 |
|------|------|
| typo-trap | 타이핑 실력을 겨루는 타이핑 게임 |
| flappy-bird | 장애물을 피해 날아가는 비행기 게임 |
| bini-puzzle | 조각을 맞추는 퍼즐 게임 |

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 구조

```
apps/web          — React 웹 포털
games/            — Pixi.js 게임 패키지
packages/         — 공유 라이브러리
docs/             — 프로젝트 문서
```

## 문서

- [아키텍처](docs/architecture.md)
- [로드맵](docs/roadmap.md)
- [Game SDK](docs/game-sdk.md)
- [AI 워크플로우](docs/ai-workflow.md)

## 기술 스택

- **모노레포**: pnpm + Turborepo
- **웹**: React 19 + Vite + Tailwind CSS
- **게임**: Pixi.js 8
- **백엔드**: Supabase
- **배포**: Vercel
