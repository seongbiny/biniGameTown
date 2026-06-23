# Biniverse PRD

## 1. 프로젝트 개요

Biniverse는 사용자가 여러 개의 미니게임을 한 곳에서 탐색하고 플레이할 수 있는 웹 기반 미니게임 플랫폼이다.

초기 버전에서는 사용자가 이미 완성된 3개의 Pixi.js 미니게임을 웹사이트 안에서 선택하고 실행할 수 있도록 한다.

초기 통합 대상 게임은 아래와 같다.

* Typo Trap
* Flappy Bird
* Bini Puzzle

Biniverse는 단순한 게임 모음 사이트가 아니라, 여러 게임을 공통 구조로 관리하고 실행할 수 있는 확장 가능한 게임 플랫폼을 목표로 한다.

## 2. 프로젝트 목적

이 프로젝트의 목적은 이직 포트폴리오에서 3년차 프론트엔드 개발자로서의 역량을 보여주는 것이다.

단순히 React 화면을 구현하는 것을 넘어서, 아래 역량을 드러내는 것을 목표로 한다.

* 제품 문제 정의
* React + TypeScript 기반 화면 구현
* 모노레포 아키텍처 설계
* 게임 실행 공통 인터페이스 설계
* 컴포넌트 구조화
* 반응형 웹 구현
* 게임별 lazy loading
* Pixi.js canvas 생명주기 관리
* 성능 최적화 기반 마련
* AI 도구를 활용한 개발 프로세스 문서화

## 3. MVP 목표

MVP의 목표는 **기존에 완성한 3개의 미니게임을 하나의 웹사이트에서 탐색하고 실행할 수 있게 만드는 것**이다.

MVP에서 제공할 기능은 아래와 같다.

* 홈 화면
* 게임 목록 화면
* 게임 상세 화면
* 게임 실행 화면
* 게임 카드 UI
* 게임 메타데이터 관리
* 공통 Game SDK 인터페이스
* 게임 실행/종료 생명주기 관리
* 반응형 레이아웃
* 기본 문서화

초기 MVP에서는 로그인, 랭킹, 어드민, React Native 앱은 만들지 않는다.

## 4. 타겟 사용자

Biniverse의 초기 타겟 사용자는 아래와 같다.

* 짧고 가벼운 미니게임을 즐기고 싶은 사용자
* 브라우저에서 바로 플레이 가능한 캐주얼 게임을 원하는 사용자
* 모바일 웹 또는 PC 웹에서 간단한 게임을 즐기고 싶은 사용자
* 포트폴리오를 확인하는 채용 담당자 또는 개발자

## 5. 핵심 사용자 시나리오

### 5.1 게임 탐색

사용자는 홈 또는 게임 목록 화면에서 제공되는 미니게임들을 확인할 수 있다.

사용자는 게임 카드에서 아래 정보를 확인할 수 있다.

* 게임 제목
* 게임 설명
* 게임 카테고리
* 난이도
* 썸네일

### 5.2 게임 상세 확인

사용자는 특정 게임을 클릭해 게임 상세 화면으로 이동할 수 있다.

게임 상세 화면에서는 아래 정보를 확인할 수 있다.

* 게임 제목
* 게임 설명
* 조작 방법
* 카테고리
* 난이도
* 플레이 버튼

### 5.3 게임 플레이

사용자는 게임 상세 화면에서 플레이 버튼을 클릭해 게임 실행 화면으로 이동한다.

게임 실행 화면에서는 선택한 게임이 canvas 영역 안에서 실행된다.

사용자는 게임 플레이를 마친 뒤 게임 목록 또는 상세 화면으로 돌아갈 수 있다.

## 6. 화면 구성

### 6.1 홈 화면

목적:

* Biniverse의 정체성을 보여준다.
* 사용자가 바로 게임을 탐색할 수 있게 한다.

포함 요소:

* 서비스 이름
* 간단한 소개 문구
* 대표 게임 섹션
* 게임 목록으로 이동하는 버튼

예시 문구:

```txt
Biniverse
작고 귀여운 미니게임들이 모여있는 나만의 게임 우주
```

### 6.2 게임 목록 화면

목적:

* 사용자가 플레이 가능한 모든 게임을 확인할 수 있게 한다.

포함 요소:

* 게임 카드 리스트
* 게임 제목
* 게임 설명
* 카테고리
* 난이도
* 플레이 또는 상세 보기 버튼

초기 MVP에서는 검색과 필터 기능은 만들지 않는다.

### 6.3 게임 상세 화면

목적:

* 게임을 실행하기 전에 게임 정보를 확인할 수 있게 한다.

포함 요소:

* 게임 제목
* 게임 설명
* 조작 방법
* 카테고리
* 난이도
* 플레이 버튼
* 게임 목록으로 돌아가기 버튼

### 6.4 게임 실행 화면

목적:

* 선택한 미니게임을 실행한다.

포함 요소:

* 게임 제목
* 게임 실행 canvas 영역
* 게임 종료 또는 뒤로가기 버튼

게임 실행 화면에서는 Game SDK 인터페이스를 통해 각 게임을 동일한 방식으로 실행한다.

## 7. 게임 메타데이터

각 게임은 공통 메타데이터를 가진다.

```ts
export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface GameMeta {
  id: string;
  title: string;
  description: string;
  categories: string[];
  difficulty: GameDifficulty;
  thumbnail: string;
  controls: string[];
}
```

초기 게임 메타데이터 예시:

```ts
export const games = [
  {
    id: 'typo-trap',
    title: 'Typo Trap',
    description: '3초 안에 오타 없는 단어를 찾는 순발력 게임',
    categories: ['word', 'speed'],
    difficulty: 'easy',
    thumbnail: '/thumbnails/typo-trap.png',
    controls: ['마우스 클릭', '터치'],
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: '장애물을 피해 날아오르는 타이밍 게임',
    categories: ['action', 'timing'],
    difficulty: 'normal',
    thumbnail: '/thumbnails/flappy-bird.png',
    controls: ['마우스 클릭', '스페이스바', '터치'],
  },
  {
    id: 'bini-puzzle',
    title: 'Bini Puzzle',
    description: '숫자 타일을 순서대로 맞추는 슬라이딩 퍼즐',
    categories: ['puzzle'],
    difficulty: 'easy',
    thumbnail: '/thumbnails/bini-puzzle.png',
    controls: ['마우스 클릭', '터치'],
  },
];
```

## 8. Game SDK 요구사항

Biniverse는 각 게임을 직접 강하게 의존하지 않고, 공통 인터페이스를 통해 실행한다.

모든 게임은 아래 생명주기를 따라야 한다.

```ts
export interface GameInstance {
  init: (container: HTMLElement) => Promise<void>;
  start: () => void;
  destroy: () => void;
  pause?: () => void;
  resume?: () => void;
}

export interface GameModule {
  id: string;
  meta: GameMeta;
  createGame: () => GameInstance;
}
```

웹사이트는 게임 내부 구현을 알 필요 없이 아래 흐름으로 게임을 실행한다.

```txt
게임 선택
→ GameModule 찾기
→ createGame()
→ init(container)
→ start()
→ 페이지 이탈 시 destroy()
```

## 9. 게임 실행 규칙

게임 실행 화면은 공통 `GamePlayer` 컴포넌트를 사용한다.

`GamePlayer`의 책임은 아래와 같다.

* 게임이 실행될 DOM container 제공
* 선택한 게임 인스턴스 생성
* 게임 초기화
* 게임 시작
* 페이지 이탈 또는 컴포넌트 unmount 시 게임 destroy
* 비동기 init 중 unmount되는 상황 처리

Pixi.js 게임은 canvas와 이벤트 리스너를 사용하므로, 게임 종료 시 반드시 리소스를 정리해야 한다.

## 10. 기술 스택

MVP 기준 기술 스택은 아래와 같다.

* pnpm workspace
* Turborepo
* React
* TypeScript
* Vite
* Pixi.js
* ESLint
* Prettier

초기 MVP에서는 Next.js를 사용하지 않는다.
우선 Vite + React 기반으로 빠르게 웹 플랫폼을 완성한다.

## 11. 모노레포 구조

초기 구조는 아래와 같다.

```txt
biniverse/
├─ apps/
│  └─ web/
├─ games/
│  ├─ typo-trap/
│  ├─ flappy-bird/
│  └─ bini-puzzle/
├─ packages/
│  ├─ game-sdk/
│  ├─ types/
│  ├─ ui/
│  └─ utils/
├─ docs/
│  ├─ prd.md
│  ├─ roadmap.md
│  ├─ architecture.md
│  ├─ game-sdk.md
│  └─ ai-workflow.md
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
└─ README.md
```

## 12. MVP 필수 기능

MVP에서 반드시 구현할 기능은 아래와 같다.

* React 웹 앱 생성
* 게임 목록 데이터 구성
* 홈 화면 구현
* 게임 목록 화면 구현
* 게임 상세 화면 구현
* 게임 실행 화면 구현
* Game SDK 패키지 생성
* GamePlayer 컴포넌트 구현
* 기존 게임 3개 이식
* 각 게임을 GameModule 형태로 export
* 페이지 이동 시 게임 destroy 처리
* 기본 반응형 레이아웃
* README 작성
* architecture 문서 작성

## 13. MVP 제외 기능

아래 기능은 MVP에서 제외한다.

* 로그인
* 회원가입
* Supabase 연동
* 랭킹 시스템
* 최고 점수 저장
* 최근 플레이 기록
* 즐겨찾기
* 검색
* 필터
* 어드민
* React Native 앱
* 푸시 알림
* 결제
* 광고
* 고도화된 디자인 시스템
* 서버 API

## 14. 반응형 요구사항

초기 MVP는 PC 웹과 모바일 웹에서 모두 기본적으로 사용할 수 있어야 한다.

필수 대응:

* 모바일 화면에서 게임 카드가 1열로 표시된다.
* 태블릿 이상에서는 게임 카드가 2열 이상으로 표시된다.
* 게임 실행 화면은 화면 너비에 맞게 중앙 정렬된다.
* canvas 영역이 화면 밖으로 과하게 넘치지 않도록 한다.

고도화된 모바일 UX는 MVP 이후에 진행한다.

## 15. 성능 요구사항

MVP에서는 아래 성능 기준을 고려한다.

* 게임 코드는 필요한 시점에만 로드한다.
* 사용자가 게임 실행 화면에 진입하기 전까지 무거운 게임 번들을 불러오지 않는다.
* 페이지 이탈 시 Pixi.js Application과 이벤트 리스너를 정리한다.
* 게임 간 이동 시 이전 게임 인스턴스가 남아있지 않아야 한다.

MVP 이후에는 아래 항목을 측정하고 개선한다.

* Lighthouse 성능 점수
* 초기 JS bundle size
* route 단위 code splitting
* 게임별 lazy loading
* memory leak 여부

## 16. 문서화 요구사항

포트폴리오 프로젝트로 활용하기 위해 아래 문서를 작성한다.

* `README.md`: 프로젝트 소개, 실행 방법, 주요 기능
* `docs/prd.md`: 제품 요구사항
* `docs/architecture.md`: 모노레포 및 게임 실행 구조
* `docs/game-sdk.md`: Game SDK 인터페이스와 게임 이식 규칙
* `docs/roadmap.md`: 단계별 개발 계획
* `docs/ai-workflow.md`: AI 도구 활용 방식

## 17. 성공 기준

MVP는 아래 조건을 만족하면 완료로 본다.

* `pnpm dev`로 웹사이트가 실행된다.
* 홈 화면이 표시된다.
* 게임 목록 화면에서 3개의 게임을 볼 수 있다.
* 각 게임의 상세 화면으로 이동할 수 있다.
* 각 게임의 실행 화면으로 이동할 수 있다.
* Typo Trap을 웹사이트 안에서 실행할 수 있다.
* Flappy Bird를 웹사이트 안에서 실행할 수 있다.
* Bini Puzzle을 웹사이트 안에서 실행할 수 있다.
* 게임 실행 화면에서 벗어나면 게임 리소스가 정리된다.
* 모바일 화면에서도 기본적인 탐색과 실행이 가능하다.
* 콘솔에 치명적인 에러가 없다.
* README와 핵심 문서가 작성되어 있다.

## 18. 향후 확장 계획

MVP 완료 후 아래 기능을 순차적으로 확장한다.

### Phase 2. 랭킹 시스템

* Supabase 연동
* 소셜 로그인
* 게임별 점수 저장
* 게임별 랭킹
* 내 최고 기록

### Phase 3. 성능 최적화

* 게임별 lazy loading 고도화
* 번들 분석
* Lighthouse 개선
* canvas memory cleanup 점검
* 성능 개선 문서 작성

### Phase 4. 모바일 앱

* React Native 또는 Expo 앱 생성
* 게임 목록과 랭킹은 Native UI로 제공
* 게임 플레이는 WebView 기반으로 연결

### Phase 5. 어드민

* 게임 관리
* 추천 게임 설정
* 랭킹 데이터 조회
* 비정상 점수 숨김 처리
* 공지 관리
