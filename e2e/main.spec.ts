import { test, expect } from '@playwright/test';

/**
 * MainPage 테스트
 * - 게임 목록이 gamesById config 기반으로 렌더링되는지 검증
 */
test.describe('MainPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main');
  });

  test('게임 로고 3개가 렌더링된다', async ({ page }) => {
    // 게임 목록 영역의 로고 이미지만 확인 (alt가 게임 타이틀인 것)
    await expect(page.locator('img[alt="BINI PUZZLE"]')).toBeVisible();
    await expect(page.locator('img[alt="FLAPPY PLANE"]')).toBeVisible();
    await expect(page.locator('img[alt="TYPO TRAP"]')).toBeVisible();
  });

  test('BINI PUZZLE 로고 클릭 시 패널이 열린다', async ({ page }) => {
    await page.locator('img[alt="BINI PUZZLE"]').click();
    // 패널 제목(h2)이 표시되어야 함 - strict mode 회피를 위해 heading role 사용
    await expect(page.getByRole('heading', { name: 'BINI PUZZLE' })).toBeVisible();
  });

  test('FLAPPY PLANE 로고 클릭 시 패널이 열린다', async ({ page }) => {
    await page.locator('img[alt="FLAPPY PLANE"]').click();
    await expect(page.getByRole('heading', { name: 'FLAPPY PLANE' })).toBeVisible();
  });

  test('TYPO TRAP 로고 클릭 시 패널이 열린다', async ({ page }) => {
    await page.locator('img[alt="TYPO TRAP"]').click();
    await expect(page.getByRole('heading', { name: 'TYPO TRAP' })).toBeVisible();
  });

  test('패널 외부 클릭 시 패널이 닫힌다', async ({ page }) => {
    await page.locator('img[alt="BINI PUZZLE"]').click();
    await expect(page.getByRole('heading', { name: 'BINI PUZZLE' })).toBeVisible();

    // 패널 외부(제목 영역) 클릭
    await page.locator('h1', { hasText: 'Games' }).click();
    // 300ms 닫힘 애니메이션 대기 후 panel이 화면 밖으로 이동
    await page.waitForTimeout(400);
    // panel은 DOM에 있지만 translate-x-full로 화면 밖
    await expect(page.getByRole('heading', { name: 'BINI PUZZLE' })).not.toBeVisible();
  });
});
