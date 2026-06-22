# Biniverse 아키텍처

## 개요

Biniverse는 Pixi.js 기반 미니게임들을 하나의 웹 플랫폼에서 제공하는 모노레포 프로젝트다.

```
biniverse/
├── apps/web          # React 웹 포털 (게임 목록, 랭킹, 인증)
├── games/            # 각 게임 패키지 (Pixi.js)
└── packages/         # 공유 라이브러리
    ├── game-sdk      # 게임 ↔ 웹 통신 프로토콜
    ├── types         # 공유 TypeScript 타입
    ├── ui            # 공유 UI 컴포넌트
    └── utils         # 공유 유틸리티
```

## 게임 호스팅 방식

각 게임은 `apps/web` 빌드 결과물 내 `/game/{game-name}/` 경로에 번들링된다.
웹 포털은 iframe으로 게임을 삽입하고, `postMessage`를 통해 게임 결과를 수신한다.

## 통신 프로토콜

```
게임 (iframe) → postMessage → 웹 포털 → Supabase (점수 저장)
```

메시지 형식은 `packages/game-sdk`에서 정의한다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 모노레포 | pnpm Workspace + Turborepo |
| 웹 포털 | React 19 + Vite + Tailwind CSS |
| 게임 엔진 | Pixi.js 8 |
| 백엔드 | Supabase (Auth + DB) |
| 배포 | Vercel |
| 언어 | TypeScript 5 |
