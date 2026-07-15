// 粒子类型定义

export const PARTICLE_TYPE_COUNT = 8;

export enum ParticleType {
  Red = 0,      // 圆形，脉冲
  Orange = 1,   // 方形，旋转
  Yellow = 2,   // 星形，闪烁
  Green = 3,    // 六边形，呼吸
  Cyan = 4,     // 菱形，流动
  Blue = 5,     // 圆环，涟漪
  Purple = 6,   // 十字形，旋转+缩放
  Pink = 7,     // 心形，跳动
}

// 粒子类型配置
export interface ParticleTypeConfig {
  type: ParticleType;
  name: string;
  color: string;
  glowColor: string;
  baseSize: number;
  shape: 'circle' | 'square' | 'star' | 'hexagon' | 'diamond' | 'ring' | 'cross' | 'heart';
  animation: 'pulse' | 'rotate' | 'flash' | 'breathe' | 'flow' | 'ripple' | 'spin-scale' | 'beat';
}

// 8种粒子类型配置
export const PARTICLE_TYPE_CONFIGS: ParticleTypeConfig[] = [
  {
    type: ParticleType.Red,
    name: '红色脉冲',
    color: '#ff4444',
    glowColor: '#ff6666',
    baseSize: 4,
    shape: 'circle',
    animation: 'pulse',
  },
  {
    type: ParticleType.Orange,
    name: '橙色旋转',
    color: '#ff8844',
    glowColor: '#ffaa66',
    baseSize: 5,
    shape: 'square',
    animation: 'rotate',
  },
  {
    type: ParticleType.Yellow,
    name: '黄色闪烁',
    color: '#ffdd44',
    glowColor: '#ffee66',
    baseSize: 3,
    shape: 'star',
    animation: 'flash',
  },
  {
    type: ParticleType.Green,
    name: '绿色呼吸',
    color: '#44ff66',
    glowColor: '#66ff88',
    baseSize: 4,
    shape: 'hexagon',
    animation: 'breathe',
  },
  {
    type: ParticleType.Cyan,
    name: '青色流动',
    color: '#44ffff',
    glowColor: '#66ffff',
    baseSize: 3.5,
    shape: 'diamond',
    animation: 'flow',
  },
  {
    type: ParticleType.Blue,
    name: '蓝色涟漪',
    color: '#4488ff',
    glowColor: '#66aaff',
    baseSize: 6,
    shape: 'ring',
    animation: 'ripple',
  },
  {
    type: ParticleType.Purple,
    name: '紫色旋转',
    color: '#aa44ff',
    glowColor: '#cc66ff',
    baseSize: 4.5,
    shape: 'cross',
    animation: 'spin-scale',
  },
  {
    type: ParticleType.Pink,
    name: '粉色跳动',
    color: '#ff66aa',
    glowColor: '#ff88cc',
    baseSize: 3,
    shape: 'heart',
    animation: 'beat',
  },
];

// 粒子数据结构
export interface Particle {
  id: number;
  type: ParticleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  // 个体属性
  energy: number;      // 能量值 (0-1)
  age: number;         // 年龄 (0-1, 1表示死亡)
  maxAge: number;      // 最大寿命
  birthTime: number;   // 出生时间
  // 动画状态
  animPhase: number;   // 动画相位
  animSpeed: number;   // 动画速度
  // 渲染状态
  size: number;        // 当前大小
  alpha: number;       // 透明度
}

// 模拟参数
export interface SimulationParams {
  particleCount: number;
  attractionRadius: number;
  repulsionRadius: number;
  attractionStrength: number;
  repulsionStrength: number;
  friction: number;
  maxSpeed: number;
  timeScale: number;
}

// 默认参数
export const DEFAULT_PARAMS: SimulationParams = {
  particleCount: 2500,
  attractionRadius: 80,
  repulsionRadius: 20,
  attractionStrength: 0.5,
  repulsionStrength: 1.0,
  friction: 0.98,
  maxSpeed: 3,
  timeScale: 1.0,
};

// 8x8 吸引/排斥矩阵
// 正值表示吸引，负值表示排斥，0表示无作用
export type AttractionMatrix = number[][];

// 生成随机矩阵
export function generateRandomMatrix(): AttractionMatrix {
  const matrix: AttractionMatrix = [];
  for (let i = 0; i < PARTICLE_TYPE_COUNT; i++) {
    matrix[i] = [];
    for (let j = 0; j < PARTICLE_TYPE_COUNT; j++) {
      // 随机生成 -1 到 1 之间的值
      matrix[i][j] = (Math.random() * 2 - 1) * 0.8;
    }
  }
  return matrix;
}

// 生成平衡矩阵（类似生命游戏的规则）
export function generateBalancedMatrix(): AttractionMatrix {
  return [
    [ 0.3, -0.5,  0.2,  0.1, -0.3,  0.4, -0.2,  0.1],
    [-0.4,  0.2,  0.5, -0.2,  0.1, -0.3,  0.3,  0.2],
    [ 0.1,  0.4, -0.1,  0.3, -0.4,  0.2,  0.1, -0.3],
    [ 0.2, -0.3,  0.1,  0.4,  0.2, -0.5,  0.3,  0.1],
    [-0.2,  0.1, -0.3,  0.2,  0.3,  0.1, -0.4,  0.5],
    [ 0.3, -0.4,  0.2, -0.1,  0.1,  0.2,  0.4, -0.2],
    [-0.1,  0.3,  0.1,  0.3, -0.2,  0.4, -0.1,  0.2],
    [ 0.2,  0.1, -0.4,  0.1,  0.5, -0.3,  0.2,  0.3],
  ];
}

// 生成聚类矩阵（同类型吸引，不同类型排斥）
export function generateClusterMatrix(): AttractionMatrix {
  const matrix: AttractionMatrix = [];
  for (let i = 0; i < PARTICLE_TYPE_COUNT; i++) {
    matrix[i] = [];
    for (let j = 0; j < PARTICLE_TYPE_COUNT; j++) {
      if (i === j) {
        matrix[i][j] = 0.8; // 同类型强吸引
      } else if (Math.abs(i - j) === 1 || Math.abs(i - j) === PARTICLE_TYPE_COUNT - 1) {
        matrix[i][j] = 0.3; // 相邻类型弱吸引
      } else {
        matrix[i][j] = -0.4; // 其他类型排斥
      }
    }
  }
  return matrix;
}
