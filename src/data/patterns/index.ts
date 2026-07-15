import type { Pattern } from '@/types/gameOfLife';
import { createPattern } from './utils';

// 静态图案 (Still Life)
const stillLifePatterns: Pattern[] = [
  createPattern('block', '方块', 'still-life', '最简单的静态图案', ['OO', 'OO']),
  createPattern('beehive', '蜂巢', 'still-life', '蜂窝状静态图案', ['.OO.', 'O..O', '.OO.']),
  createPattern('loaf', '面包', 'still-life', '面包形状', ['.OO.', 'O..O', '.O.O', '..O.']),
  createPattern('boat', '船', 'still-life', '小船形状', ['OO.', 'O.O', '.O.']),
  createPattern('tub', '浴缸', 'still-life', '浴缸形状', ['.O.', 'O.O', '.O.']),
  createPattern('pond', '池塘', 'still-life', '池塘形状', ['.OO.', 'O..O', 'O..O', '.OO.']),
  createPattern('long-boat', '长船', 'still-life', '加长版船', ['OO..', 'O.O.', '.O.O', '..O.']),
  createPattern('ship', '舰', 'still-life', '舰形状', ['OO.', 'O.O', '.OO']),
  createPattern('snake', '蛇', 'still-life', '蛇形状', ['.OO', 'OO.', '.OO']),
  createPattern('eater1', '食者1', 'still-life', '经典食者', ['O..', 'OO.', '.OO']),
  createPattern('hat', '帽子', 'still-life', '帽子形状', ['.OO.', 'O..O', '.OO.']),
];

// 振荡器 (Oscillators)
const oscillatorPatterns: Pattern[] = [
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
  createPattern('clock', '时钟', 'oscillator', '周期为4', ['..O.', 'O.O.', '.O.O', '.O..'], { period: 4 }),
  createPattern('cross', '十字', 'oscillator', '周期为3', ['..O..', '.OOO.', 'OO.OO', '.OOO.', '..O..'], { period: 3 }),
];

// 飞船 (Spaceships)
const spaceshipPatterns: Pattern[] = [
  createPattern('glider', '滑翔机', 'spaceship', '最简单的飞船', ['.O.', '..O', 'OOO'], { speed: 'c/4' }),
  createPattern('lwss', '轻量级飞船', 'spaceship', '最小正交飞船', ['O..O.', '....O', 'O...O', '.OOOO'], { speed: 'c/2' }),
  createPattern('mwss', '中量级飞船', 'spaceship', '中等正交飞船', ['..O...', 'O...O.', '.....O', 'O....O', '.OOOOO'], { speed: 'c/2' }),
  createPattern('hwss', '重量级飞船', 'spaceship', '最大正交飞船', ['...OO..', '.O....O', 'O......', 'O.....O', '.OOOOOO'], { speed: 'c/2' }),
];

// 枪 (Guns)
const gunPatterns: Pattern[] = [
  createPattern('gosper-glider-gun', 'Gosper滑翔机枪', 'gun', '第一个滑翔机枪', [
    '........................O...........', '......................O.O...........',
    '............OO......OO............OO', '...........O...O....OO............OO',
    'OO........O.....O...OO..............', 'OO........O...O.OO....O.O...........',
    '..........O.....O.......O...........', '...........O...O....................',
    '............OO......................',
  ], { author: 'Bill Gosper', year: 1970 }),
];

// 食者 (Eaters)
const eaterPatterns: Pattern[] = [
  createPattern('eater-block', '方块食者', 'eater', '吞噬滑翔机的方块', ['OO', 'OO']),
  createPattern('eater-boat', '船食者', 'eater', '吞噬滑翔机的船', ['OO.', 'O.O', '.O.']),
  createPattern('eater-pond', '池塘食者', 'eater', '吞噬滑翔机的池塘', ['.OO.', 'O..O', 'O..O', '.OO.']),
];

// 喷气船 (Puffers)
const pufferPatterns: Pattern[] = [
  createPattern('puffer1', '喷气船1', 'puffer', '经典喷气船', [
    '.O.', 'O.O', '.O.', '...', '.O.', 'O.O', '.O.',
  ]),
];

// 长寿者 (Methuselahs)
const methuselahPatterns: Pattern[] = [
  createPattern('r-pentomino', 'R五格骨牌', 'methuselah', '最著名的小型长寿者', ['.OO', 'OO.', '.O.']),
  createPattern('diehard', '顽固者', 'methuselah', '存活130代的顽固者', [
    '......O.', 'OO......', '.O...OOO',
  ]),
  createPattern('acorn', '橡果', 'methuselah', '橡果图案', [
    '.O.....', '...O...', 'OO..OOO',
  ]),
];

// 导出所有模板
export const allPatterns: Pattern[] = [
  ...stillLifePatterns,
  ...oscillatorPatterns,
  ...spaceshipPatterns,
  ...gunPatterns,
  ...eaterPatterns,
  ...pufferPatterns,
  ...methuselahPatterns,
];

// 按类别分组
export const patternsByCategory: Record<string, Pattern[]> = {
  'still-life': stillLifePatterns,
  'oscillator': oscillatorPatterns,
  'spaceship': spaceshipPatterns,
  'gun': gunPatterns,
  'eater': eaterPatterns,
  'puffer': pufferPatterns,
  'methuselah': methuselahPatterns,
};

// 搜索模板
export function searchPatterns(query: string): Pattern[] {
  const lowerQuery = query.toLowerCase();
  return allPatterns.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.id.toLowerCase().includes(lowerQuery)
  );
}

// 按类别获取模板
export function getPatternsByCategory(category: string): Pattern[] {
  return patternsByCategory[category] || [];
}
