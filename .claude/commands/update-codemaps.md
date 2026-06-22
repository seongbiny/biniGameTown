---
name: update-codemaps
description: 코드베이스 구조를 분석하고 아키텍처 문서 업데이트
allowed-tools: Read, Write, Edit, Grep, Glob
---

## 이 커맨드가 하는 일

1. 모든 소스 파일의 임포트, 익스포트, 의존성 스캔
2. 다음 형식으로 토큰 효율적인 코드맵 생성:
   - codemaps/architecture.md - 전체 아키텍처
   - codemaps/backend.md - 백엔드 구조
   - codemaps/frontend.md - 프론트엔드 구조
   - codemaps/data.md - 데이터 모델 및 스키마
3. 이전 버전과의 차이 비율 계산
4. 변경이 30% 초과 시 업데이트 전 사용자 승인 요청
5. 각 코드맵에 최신 타임스탬프 추가

## 코드맵 구조

```
codemaps/
├── architecture.md    # 전체 시스템 아키텍처
├── backend.md         # 백엔드 구조
├── frontend.md        # 프론트엔드 구조
└── data.md           # 데이터 모델
```

## 분석 도구

```bash
# 의존성 그래프 생성
npx madge --image graph.svg src/

# TypeScript 구조 분석
npx ts-morph
```

**원칙**: 구현 세부사항이 아닌 고수준 구조에 집중. 각 코드맵은 500줄 미만 유지.
