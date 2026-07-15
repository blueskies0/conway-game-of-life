import type { Pattern } from '@/types/gameOfLife';
import { createPattern } from './utils';

// 飞船 (Spaceships)
export const spaceshipPatterns: Pattern[] = [
  createPattern('glider', '滑翔机', 'spaceship', '最简单的飞船', ['.O.', '..O', 'OOO'], { speed: 'c/4' }),
  createPattern('lwss', '轻量级飞船', 'spaceship', '最小正交飞船', ['O..O.', '....O', 'O...O', '.OOOO'], { speed: 'c/2' }),
  createPattern('mwss', '中量级飞船', 'spaceship', '中等正交飞船', ['..O...', 'O...O.', '.....O', 'O....O', '.OOOOO'], { speed: 'c/2' }),
  createPattern('hwss', '重量级飞船', 'spaceship', '最大正交飞船', ['...OO..', '.O....O', 'O......', 'O.....O', '.OOOOOO'], { speed: 'c/2' }),
  createPattern('glider-se', '滑翔机(东南)', 'spaceship', '向东南飞行的滑翔机', ['OOO', 'O..', '.O.'], { speed: 'c/4' }),
  createPattern('glider-sw', '滑翔机(西南)', 'spaceship', '向西南飞行的滑翔机', ['OOO', '..O', '.O.'], { speed: 'c/4' }),
  createPattern('glider-ne', '滑翔机(东北)', 'spaceship', '向东北飞行的滑翔机', ['.O.', 'O..', 'OOO'], { speed: 'c/4' }),
  createPattern('glider-nw', '滑翔机(西北)', 'spaceship', '向西北飞行的滑翔机', ['.O.', '..O', 'OOO'], { speed: 'c/4' }),
  createPattern('copperhead', '铜头蛇', 'spaceship', '小型飞船', ['..OO..', '.O..O.', '.O..O.', '.O..O.', '..OO..'], { speed: 'c/4' }),
  createPattern('loafer', '流浪者', 'spaceship', '小型飞船', ['.O....', '..O...', 'OOO...', '...OO.', '..O..O', '.....O'], { speed: 'c/7' }),
  createPattern('spider', '蜘蛛', 'spaceship', '大型飞船', ['.O.....O.', 'O.O...O.O', 'O.O...O.O', 'OO.....OO', '.........', 'OO.....OO'], { speed: 'c/5' }),
  createPattern('weekender', '周末旅行者', 'spaceship', '大型飞船', [
    '..OO...OO..', '..O.O.O.O..', '...O...O...', 'O.........O', 'OO.......OO',
    '...O...O...', '..O.O.O.O..', '..OO...OO..',
  ], { speed: '2c/7' }),
  createPattern('dart', '飞镖', 'spaceship', '小型飞船', ['....O...', '..O...O.', '.O......', 'O......O', 'OOOOOOOO'], { speed: 'c/3' }),
  createPattern('crab', '螃蟹', 'spaceship', '小型飞船', ['.O......', 'O.O.....', 'O..O...O', 'OOOO.O.O', '.....O.O', '......O.'], { speed: 'c/4' }),
];
