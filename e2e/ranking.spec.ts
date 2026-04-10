import { test, expect } from '@playwright/test';

/**
 * RankingPage 테스트
 * - 게임 탭이 gamesById config 기반으로 렌더링되는지 검증
 */
test.describe('RankingPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ranking');
  });

  test('게임 선택 버튼 3개가 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'BINI PUZZLE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'FLAPPY PLANE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'TYPO TRAP' })).toBeVisible();
  });

  test('게임 선택 버튼이 정확히 3개다', async ({ page }) => {
    // config의 게임 수만큼만 버튼이 생성되어야 함
    const buttons = page.getByRole('button');
    await expect(buttons).toHaveCount(3);
  });

  test('게임 선택 전에는 랭킹 목록이 없다', async ({ page }) => {
    await expect(page.locator('ol')).not.toBeVisible();
  });
});
