# Game SDK

`packages/game-sdk`는 게임과 웹 포털 간 통신 프로토콜을 정의하는 공유 패키지다.

## 역할

- 게임 결과 전송 (`submitGameResult`)
- 메시지 타입 정의
- 웹 포털의 메시지 수신 헬퍼

## 메시지 형식

```ts
type GameMessage =
  | { type: 'BGT_GAME_RESULT'; payload: GameResultPayload }
  | { type: 'BGT_GAME_READY' };

type GameResultPayload = {
  gameName: GameId;
  score: number;
  difficulty: 'easy' | 'normal' | 'hard';
};
```

## 게임에서 사용

```ts
import { submitGameResult } from '@biniverse/game-sdk';

submitGameResult('typo-trap', 1200, 'normal');
```

내부적으로 `window.parent.postMessage(message, targetOrigin)` 호출.

## 웹 포털에서 수신

```ts
import { onGameMessage } from '@biniverse/game-sdk';

onGameMessage((message) => {
  if (message.type === 'BGT_GAME_RESULT') {
    // Supabase에 점수 저장
  }
});
```
