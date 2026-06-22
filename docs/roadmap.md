# Biniverse 로드맵

## Phase 1 — 모노레포 뼈대 (현재)

- [x] 저장소 초기화 및 모노레포 구조 설정
- [x] Turborepo + pnpm workspace 구성
- [x] TypeScript / ESLint / Prettier 기본 설정
- [ ] 공유 패키지 (`game-sdk`, `types`, `ui`, `utils`) 초기 구현
- [ ] apps/web — React 웹 포털 초기 셋업

## Phase 2 — 게임 이식

- [ ] typo-trap 마이그레이션
- [ ] flappy-bird 마이그레이션
- [ ] bini-puzzle 마이그레이션
- [ ] 각 게임 → game-sdk 연동 검증

## Phase 3 — 플랫폼 기능

- [ ] 유저 인증 (Supabase Auth)
- [ ] 점수 저장 및 랭킹
- [ ] 메인 포털 UI 완성

## Phase 4 — 배포 및 운영

- [ ] Vercel 배포 파이프라인 구성
- [ ] 도메인 연결
- [ ] 모니터링 및 에러 트래킹
