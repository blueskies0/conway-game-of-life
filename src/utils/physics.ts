// 物理计算函数

import type { Particle, ParticleType, SimulationParams, AttractionMatrix } from '@/types/particle';
import { PARTICLE_TYPE_COUNT } from '@/types/particle';

// 计算两点之间的距离
export function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// 计算两点之间的距离平方（避免开方，用于比较）
export function distanceSquared(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

// 计算粒子间的力
export function calculateForces(
  particles: Particle[],
  params: SimulationParams,
  matrix: AttractionMatrix,
  canvasWidth: number,
  canvasHeight: number
): void {
  const { attractionRadius, repulsionRadius, attractionStrength, repulsionStrength } = params;
  const attractionRadiusSq = attractionRadius * attractionRadius;
  const repulsionRadiusSq = repulsionRadius * repulsionRadius;

  // 使用空间网格优化（简单的均匀网格）
  const cellSize = attractionRadius;
  const cols = Math.ceil(canvasWidth / cellSize);
  const rows = Math.ceil(canvasHeight / cellSize);
  
  // 构建空间网格
  const grid: Map<number, number[]> = new Map();
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const col = Math.floor(p.x / cellSize);
    const row = Math.floor(p.y / cellSize);
    const key = row * cols + col;
    
    if (!grid.has(key)) {
      grid.set(key, []);
    }
    grid.get(key)!.push(i);
  }

  // 计算力
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    const col = Math.floor(p1.x / cellSize);
    const row = Math.floor(p1.y / cellSize);
    
    let fx = 0;
    let fy = 0;

    // 检查相邻的网格单元
    for (let dc = -1; dc <= 1; dc++) {
      for (let dr = -1; dr <= 1; dr++) {
        const nc = col + dc;
        const nr = row + dr;
        
        if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
        
        const key = nr * cols + nc;
        const cell = grid.get(key);
        
        if (!cell) continue;
        
        for (const j of cell) {
          if (i === j) continue;
          
          const p2 = particles[j];
          const distSq = distanceSquared(p1, p2);
          
          // 排斥力（近距离）
          if (distSq < repulsionRadiusSq && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = repulsionStrength * (1 - dist / repulsionRadius);
            const dx = (p1.x - p2.x) / dist;
            const dy = (p1.y - p2.y) / dist;
            fx += dx * force;
            fy += dy * force;
          }
          // 吸引力（中距离）
          else if (distSq < attractionRadiusSq && distSq >= repulsionRadiusSq) {
            const dist = Math.sqrt(distSq);
            const attractionValue = matrix[p1.type][p2.type];
            
            if (Math.abs(attractionValue) > 0.01) {
              const force = attractionStrength * attractionValue * 
                (1 - (dist - repulsionRadius) / (attractionRadius - repulsionRadius));
              const dx = (p2.x - p1.x) / dist;
              const dy = (p2.y - p1.y) / dist;
              fx += dx * force;
              fy += dy * force;
            }
          }
        }
      }
    }

    // 应用力
    p1.vx += fx * 0.1;
    p1.vy += fy * 0.1;
  }
}

// 更新粒子位置和状态
export function updateParticles(
  particles: Particle[],
  params: SimulationParams,
  canvasWidth: number,
  canvasHeight: number,
  deltaTime: number
): void {
  const { friction, maxSpeed, timeScale } = params;
  const dt = deltaTime * timeScale;
  const now = Date.now();

  for (const p of particles) {
    // 应用摩擦力
    p.vx *= friction;
    p.vy *= friction;

    // 限制最大速度
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed;
      p.vy = (p.vy / speed) * maxSpeed;
    }

    // 更新位置
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // 边界处理（环绕）
    if (p.x < 0) p.x += canvasWidth;
    if (p.x >= canvasWidth) p.x -= canvasWidth;
    if (p.y < 0) p.y += canvasHeight;
    if (p.y >= canvasHeight) p.y -= canvasHeight;

    // 更新年龄
    const age = (now - p.birthTime) / (p.maxAge * 1000);
    p.age = Math.min(age, 1);

    // 更新能量（根据速度）
    const speedRatio = speed / maxSpeed;
    p.energy = Math.min(p.energy + speedRatio * 0.01, 1);
    p.energy *= 0.999; // 缓慢衰减

    // 更新动画相位
    p.animPhase += p.animSpeed * dt;
    if (p.animPhase > Math.PI * 2) {
      p.animPhase -= Math.PI * 2;
    }

    // 更新大小（基于生命周期和能量）
    const lifeFactor = 1 - Math.abs(p.age - 0.5) * 2; // 中间最大
    const energyFactor = 0.5 + p.energy * 0.5;
    p.size = p.size * 0.95 + (lifeFactor * energyFactor) * 0.05;

    // 更新透明度
    p.alpha = 0.3 + lifeFactor * 0.7;
  }
}

// 初始化粒子
export function initializeParticles(
  count: number,
  canvasWidth: number,
  canvasHeight: number
): Particle[] {
  const particles: Particle[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const type = Math.floor(Math.random() * PARTICLE_TYPE_COUNT) as ParticleType;
    
    particles.push({
      id: i,
      type,
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      energy: Math.random() * 0.5 + 0.5,
      age: 0,
      maxAge: 30 + Math.random() * 60, // 30-90秒寿命
      birthTime: now - Math.random() * 10000,
      animPhase: Math.random() * Math.PI * 2,
      animSpeed: 0.5 + Math.random() * 1.5,
      size: 1,
      alpha: 1,
    });
  }

  return particles;
}

// 重生死亡的粒子
export function respawnDeadParticles(
  particles: Particle[],
  canvasWidth: number,
  canvasHeight: number
): void {
  const now = Date.now();
  
  for (const p of particles) {
    if (p.age >= 1) {
      // 重生
      p.type = Math.floor(Math.random() * PARTICLE_TYPE_COUNT) as ParticleType;
      p.x = Math.random() * canvasWidth;
      p.y = Math.random() * canvasHeight;
      p.vx = (Math.random() - 0.5) * 2;
      p.vy = (Math.random() - 0.5) * 2;
      p.energy = Math.random() * 0.5 + 0.5;
      p.age = 0;
      p.maxAge = 30 + Math.random() * 60;
      p.birthTime = now;
      p.animPhase = Math.random() * Math.PI * 2;
    }
  }
}
