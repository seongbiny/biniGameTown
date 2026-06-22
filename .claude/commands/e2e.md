---
name: e2e
description: Playwright로 end-to-end 테스트를 생성하고 실행
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## 이 커맨드가 하는 일

1. **테스트 여정 생성** - 사용자 흐름을 위한 Playwright 테스트 생성
2. **E2E 테스트 실행** - 여러 브라우저에서 테스트 실행
3. **아티팩트 캡처** - 실패 시 스크린샷, 비디오, 트레이스
4. **결과 업로드** - HTML 리포트 및 JUnit XML
5. **불안정한 테스트 식별** - 불안정한 테스트 격리

## 빠른 명령어

```bash
# 모든 E2E 테스트 실행
npx playwright test

# headed 모드로 실행
npx playwright test --headed

# 테스트 디버그
npx playwright test --debug

# 테스트 코드 생성
npx playwright codegen http://localhost:3000

# 리포트 보기
npx playwright show-report
```

## 모범 사례

**해야 할 것:**
- Page Object Model 사용
- data-testid 속성 사용
- 임의의 타임아웃 대신 API 응답 대기

**하지 말아야 할 것:**
- 불안정한 선택자 사용 (CSS 클래스)
- 프로덕션에서 테스트 실행
- 불안정한 테스트 무시

**치명적**: 실제 돈이 관련된 E2E 테스트는 반드시 테스트넷/스테이징에서만 실행!
