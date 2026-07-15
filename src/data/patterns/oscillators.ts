import type { Pattern } from '@/types/gameOfLife';
import { createPattern } from './utils';

// 振荡器 (Oscillators)
export const oscillatorPatterns: Pattern[] = [
  createPattern('blinker', '闪光灯', 'oscillator', '最简单的振荡器', ['OOO'], { period: 2 }),
  createPattern('toad', '蟾蜍', 'oscillator', '周期为2', ['.OOO', 'OOO.'], { period: 2 }),
  createPattern('beacon', '灯塔', 'oscillator', '周期为2', ['OO..', 'OO..', '..OO', '..OO'], { period: 2 }),
  createPattern('pulsar', '脉冲星', 'oscillator', '周期为3的大型振荡器', [
    '..OOO...OOO..', '.............', 'O....O.O....O', 'O....O.O....O', 'O....O.O....O',
    '..OOO...OOO..', '.............', '..OOO...OOO..', 'O....O.O....O', 'O....O.O....O',
    'O....O.O....O', '.............', '..OOO...OOO..',
  ], { period: 3 }),
  createPattern('pentadecathlon', '五格骨牌', 'oscillator', '周期为15', [
    '..O.....O..', 'OO.OOOO.OO.', '..O.....O..',
  ], { period: 15 }),
  createPattern('figure-eight', '图8', 'oscillator', '周期为8', ['OOO', 'OOO', 'OOO'], { period: 8 }),
  createPattern('caterer', '毛毛虫', 'oscillator', '周期为3', ['....O', '.O...', 'O..OO', 'OO..O', '...O.'], { period: 3 }),
  createPattern('fumarole', '烟孔', 'oscillator', '周期为5', ['..OO.', '.O..O', 'O...O', '.O..O', '..OO.'], { period: 5 }),
  createPattern('octagon2', '八角形2', 'oscillator', '周期为5', ['.OO..', 'O..O.', 'O..O.', '.OO..'], { period: 5 }),
  createPattern('unix', 'Unix', 'oscillator', '周期为6', ['.O...', 'O.O..', '.O...', '..OOO', '.....', '..OOO'], { period: 6 }),
  createPattern('bipole', '双极', 'oscillator', '周期为2', ['OO.', 'O.O', '.OO'], { period: 2 }),
  createPattern('tripole', '三极', 'oscillator', '周期为3', ['OO..', 'O.O.', '.O.O', '..OO'], { period: 3 }),
  createPattern('quadpole', '四极', 'oscillator', '周期为2', ['OO...', 'O.O..', '.O.O.', '..O.O', '...OO'], { period: 2 }),
  createPattern('spark-coil', '火花线圈', 'oscillator', '周期为2', [
    'OO...OO', 'O.O.O.O', '..O.O..', 'O.O.O.O', 'OO...OO',
  ], { period: 2 }),
  createPattern('barberpole', '理发杆', 'oscillator', '周期为2', ['OOO.', 'O..O', '.O.O', '.OOO'], { period: 2 }),
  createPattern('twin-hat', '双帽', 'oscillator', '周期为2', ['.OO.OO.', 'O..O..O', '.OO.OO.'], { period: 2 }),
  createPattern('test-tube', '试管', 'oscillator', '周期为2', ['OO...OO', 'O.O.O.O', '..O.O..'], { period: 2 }),
  createPattern('clock', '时钟', 'oscillator', '周期为4', ['..O.', 'O.O.', '.O.O', '.O..'], { period: 4 }),
  createPattern('biting-off-more', '贪多嚼不烂', 'oscillator', '周期为10', [
    '...O...', '..O.O..', '.O...O.', 'O.OOO.O', '.O...O.', '..O.O..', '...O...',
  ], { period: 10 }),
  createPattern('cross', '十字', 'oscillator', '周期为3', ['..O..', '.OOO.', 'OO.OO', '.OOO.', '..O..'], { period: 3 }),
];
