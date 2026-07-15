import type { Pattern, PatternCategory } from '@/types/gameOfLife';

// 辅助函数：创建模板
export function createPattern(
  id: string,
  name: string,
  category: PatternCategory,
  description: string,
  cells: string[],
  options: Partial<Pattern> = {}
): Pattern {
  const aliveCells: { x: number; y: number }[] = [];
  let width = 0;
  let height = cells.length;

  cells.forEach((row, y) => {
    width = Math.max(width, row.length);
    row.split('').forEach((char, x) => {
      if (char === 'O' || char === '1' || char === '#') {
        aliveCells.push({ x, y });
      }
    });
  });

  return {
    id,
    name,
    category,
    description,
    cells: aliveCells,
    width,
    height,
    ...options,
  };
}
