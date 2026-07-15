import type { Pattern } from '@/types/gameOfLife';
import { createPattern } from './utils';

// 静态图案 (Still Life)
export const stillLifePatterns: Pattern[] = [
  createPattern('block', '方块', 'still-life', '最简单的静态图案', ['OO', 'OO']),
  createPattern('beehive', '蜂巢', 'still-life', '蜂窝状静态图案', ['.OO.', 'O..O', '.OO.']),
  createPattern('loaf', '面包', 'still-life', '面包形状', ['.OO.', 'O..O', '.O.O', '..O.']),
  createPattern('boat', '船', 'still-life', '小船形状', ['OO.', 'O.O', '.O.']),
  createPattern('tub', '浴缸', 'still-life', '浴缸形状', ['.O.', 'O.O', '.O.']),
  createPattern('pond', '池塘', 'still-life', '池塘形状', ['.OO.', 'O..O', 'O..O', '.OO.']),
  createPattern('long-boat', '长船', 'still-life', '加长版船', ['OO..', 'O.O.', '.O.O', '..O.']),
  createPattern('mango', '芒果', 'still-life', '芒果形状', ['OO..', 'O.O.', '..OO']),
  createPattern('ship', '舰', 'still-life', '舰形状', ['OO.', 'O.O', '.OO']),
  createPattern('long-ship', '长舰', 'still-life', '加长版舰', ['OO..', 'O.O.', '.O.O', '..OO']),
  createPattern('snake', '蛇', 'still-life', '蛇形状', ['.OO', 'OO.', '.OO']),
  createPattern('big-snake', '大蛇', 'still-life', '大蛇形状', ['.OOO', 'OO..', '..OO']),
  createPattern('barge', '驳船', 'still-life', '驳船形状', ['.O.', 'O.O', '.O.']),
  createPattern('long-barge', '长驳船', 'still-life', '加长版驳船', ['.O..', 'O.O.', '.O.O', '..O.']),
  createPattern('eater1', '食者1', 'still-life', '经典食者', ['O..', 'OO.', '.OO']),
  createPattern('eater2', '食者2', 'still-life', '另一种食者', ['.O.', 'O.O', 'OO.', '.O.']),
  createPattern('hat', '帽子', 'still-life', '帽子形状', ['.OO.', 'O..O', '.OO.']),
  createPattern('cis-fuse', '顺式引信', 'still-life', '顺式引信', ['OO.', '.O.', '.OO']),
  createPattern('trans-fuse', '反式引信', 'still-life', '反式引信', ['OO.', '.O.', 'OO.']),
  createPattern('integral', '积分', 'still-life', '积分形状', ['OO..', 'O.O.', '.OO.', '..O.']),
  createPattern('shillelagh', '棍棒', 'still-life', '棍棒形状', ['OO.', '.O.', '.OO']),
];
