// 康威生命游戏类型定义

export interface Cell {
  x: number;
  y: number;
  alive: boolean;
  age: number; // 细胞存活代数，用于颜色渐变
}

export interface Grid {
  width: number;
  height: number;
  cells: boolean[][]; // true = alive, false = dead
  ages: number[][]; // 每个细胞的存活代数
}

export interface GameState {
  grid: Grid;
  generation: number;
  population: number;
  isRunning: boolean;
  speed: number; // 毫秒每代
}

// 模板类别
export type PatternCategory = 
  | 'still-life'      // 静态
  | 'oscillator'      // 振荡器
  | 'spaceship'       // 飞船
  | 'gun'             // 枪
  | 'eater'           // 食者
  | 'puffer'          // 喷气船
  | 'breeder'         // 繁殖者
  | 'methuselah'      // 长寿者
  | 'sawtooth'        // 锯齿波
  | 'wick'            // 导火索
  | 'fuse'            // 引信
  | 'converter'       // 转换器
  | 'reflector'       // 反射器
  | 'other';          // 其他

// 模板定义
export interface Pattern {
  id: string;
  name: string;
  category: PatternCategory;
  description: string;
  author?: string;
  year?: number;
  cells: { x: number; y: number }[]; // 活细胞的相对坐标
  width: number;
  height: number;
  period?: number; // 振荡周期
  speed?: string; // 飞船速度 (如 c/4)
}

// 类别中文名称
export const CATEGORY_NAMES: Record<PatternCategory, string> = {
  'still-life': '静态图案',
  'oscillator': '振荡器',
  'spaceship': '飞船',
  'gun': '枪',
  'eater': '食者',
  'puffer': '喷气船',
  'breeder': '繁殖者',
  'methuselah': '长寿者',
  'sawtooth': '锯齿波',
  'wick': '导火索',
  'fuse': '引信',
  'converter': '转换器',
  'reflector': '反射器',
  'other': '其他',
};

// 类别图标
export const CATEGORY_ICONS: Record<PatternCategory, string> = {
  'still-life': '⬛',
  'oscillator': '⚡',
  'spaceship': '🚀',
  'gun': '🔫',
  'eater': '🍽️',
  'puffer': '💨',
  'breeder': '🐰',
  'methuselah': '👴',
  'sawtooth': '🪚',
  'wick': '🕯️',
  'fuse': '💣',
  'converter': '🔄',
  'reflector': '🔁',
  'other': '📦',
};

// 游戏参数
export interface GameParams {
  cellSize: number;
  gridWidth: number;
  gridHeight: number;
  speed: number; // 毫秒每代
  glowIntensity: number;
  showTrails: boolean;
  trailLength: number;
}

export const DEFAULT_PARAMS: GameParams = {
  cellSize: 8,
  gridWidth: 120,
  gridHeight: 80,
  speed: 100,
  glowIntensity: 0.8,
  showTrails: true,
  trailLength: 5,
};
