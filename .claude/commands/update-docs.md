---
name: update-docs
description: 진실의 소스에서 문서 동기화
allowed-tools: Read, Write, Edit, Grep, Glob
---

## 이 커맨드가 하는 일

1. package.json scripts 섹션 읽기
   - 스크립트 참조 테이블 생성
   - 주석의 설명 포함

2. .env.example 읽기
   - 모든 환경 변수 추출
   - 목적과 형식 문서화

3. docs/CONTRIB.md 생성:
   - 개발 워크플로우
   - 사용 가능한 스크립트
   - 환경 설정
   - 테스트 절차

4. docs/RUNBOOK.md 생성:
   - 배포 절차
   - 모니터링 및 알림
   - 일반적인 문제와 해결
   - 롤백 절차

5. 오래된 문서 식별:
   - 90일 이상 수정되지 않은 문서 찾기

## 진실의 소스

문서는 다음에서 생성됩니다:
- package.json - 스크립트, 설명
- .env.example - 환경 변수
- 코드 주석 - JSDoc, TSDoc

**원칙**: 단일 진실의 소스. 문서는 항상 코드에서 생성되어야 합니다.
