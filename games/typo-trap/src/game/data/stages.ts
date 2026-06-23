import type { Stage } from '../types';

function makeOptions(correct: string, typo: string, total: number): string[] {
  return [...Array<string>(total - 1).fill(correct), typo];
}

export const stages: Stage[] = [
  {
    id: 1,
    answer: '샤자',
    options: makeOptions('사자', '샤자', 4),
  },
  {
    id: 2,
    answer: '바따',
    options: makeOptions('바다', '바따', 9),
  },
  {
    id: 3,
    answer: '나므',
    options: makeOptions('나무', '나므', 16),
  },
  {
    id: 4,
    answer: '고냥이',
    options: makeOptions('고양이', '고냥이', 25),
  },
  {
    id: 5,
    answer: '하뉼',
    options: makeOptions('하늘', '하뉼', 25),
  },
];
