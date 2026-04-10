import { test, expect } from '@playwright/test';

/**
 * GamePage 테스트
 * - 유효/무효 gameName 라우팅 검증
 * - iframe 렌더링 검증
 */
test.describe('GamePage', () => {
  test('유효하지 않은 게임명으로 접근하면 /main으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/game/not-a-game');
    await expect(page).toHaveURL('/main');
  });

  test('bini-puzzle 경로 접근 시 iframe이 렌더링된다', async ({ page }) => {
    await page.goto('/game/bini-puzzle');
    // 프로덕션 빌드가 없으면 iframe src는 /game/bini-puzzle/ 경로
    // 개발 환경에서는 localhost:5001이지만 여기선 src 속성만 확인
    const iframe = page.locator('iframe[title="bini-puzzle"]');
    await expect(iframe).toBeAttached();
  });

  test('flappy-plane 경로 접근 시 iframe이 렌더링된다', async ({ page }) => {
    await page.goto('/game/flappy-plane');
    await expect(page.locator('iframe[title="flappy-plane"]')).toBeAttached();
  });

  test('typo-trap 경로 접근 시 iframe이 렌더링된다', async ({ page }) => {
    await page.goto('/game/typo-trap');
    await expect(page.locator('iframe[title="typo-trap"]')).toBeAttached();
  });

  test('뒤로가기 버튼 클릭 시 /main으로 이동한다', async ({ page }) => {
    await page.goto('/game/flappy-plane');
    await page.getByRole('button', { name: '← 뒤로가기' }).click();
    await expect(page).toHaveURL('/main');
  });
});
