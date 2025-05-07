import { Container } from 'pixi.js';
import { gsap } from 'gsap';

/**
 * 타일 이동 애니메이션 함수
 */
export function animateTileSwapUI(
  fromTile: Container,
  toTile: Container,
  onComplete: () => void,
  setAnimating: (isAnimating: boolean) => void
): void {
  // 애니메이션 중 상태로 설정
  setAnimating(true);

  // 클릭한 타일의 z-index 조정 (다른 타일 위로 표시)
  fromTile.zIndex = 10;

  // 클릭한 타일의 현재 위치 저장
  const fromX = fromTile.position.x;
  const fromY = fromTile.position.y;

  // 빈 타일의 위치 저장
  const toX = toTile.position.x;
  const toY = toTile.position.y;

  // GSAP 애니메이션 적용
  gsap.to(fromTile.position, {
    x: toX,
    y: toY,
    duration: 0.3, // 애니메이션 지속 시간 (초)
    ease: 'power2.out', // 이징 함수
    onComplete: () => {
      // 타일 컨테이너 위치 원래대로 복원
      fromTile.position.set(fromX, fromY);

      // z-index 원래대로 복원
      fromTile.zIndex = 1;

      // 애니메이션 종료 상태로 설정
      setAnimating(false);

      // 콜백 실행
      onComplete();
    },
  });
}

/**
 * 타일 떨림 애니메이션 함수
 */
export function animateShake(
  tile: Container,
  setAnimating: (isAnimating: boolean) => void
): void {
  setAnimating(true);

  const originalX = tile.position.x;

  // GSAP 타임라인을 사용한 떨림 애니메이션
  gsap
    .timeline()
    .to(tile.position, {
      x: originalX - 5,
      duration: 0.05,
      ease: 'power1.inOut',
    })
    .to(tile.position, {
      x: originalX + 5,
      duration: 0.1,
      ease: 'power1.inOut',
    })
    .to(tile.position, {
      x: originalX - 4,
      duration: 0.1,
      ease: 'power1.inOut',
    })
    .to(tile.position, {
      x: originalX + 3,
      duration: 0.1,
      ease: 'power1.inOut',
    })
    .to(tile.position, {
      x: originalX - 2,
      duration: 0.05,
      ease: 'power1.inOut',
    })
    .to(tile.position, {
      x: originalX,
      duration: 0.05,
      ease: 'power1.inOut',
      onComplete: () => {
        setAnimating(false);
      },
    });
}
