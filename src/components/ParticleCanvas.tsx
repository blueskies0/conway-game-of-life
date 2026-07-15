import { useRef, useEffect, useCallback } from 'react';
import type { Particle, ParticleTypeConfig } from '@/types/particle';
import { PARTICLE_TYPE_CONFIGS } from '@/types/particle';

interface ParticleCanvasProps {
  particles: Particle[];
  width: number;
  height: number;
}

// 绘制不同形状的粒子
function drawParticleShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  config: ParticleTypeConfig,
  animPhase: number,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  
  // 应用动画效果
  let scale = 1;
  let rotation = 0;
  
  switch (config.animation) {
    case 'pulse':
      scale = 1 + Math.sin(animPhase) * 0.2;
      break;
    case 'rotate':
      rotation = animPhase;
      break;
    case 'flash':
      alpha *= 0.7 + Math.sin(animPhase * 3) * 0.3;
      break;
    case 'breathe':
      scale = 1 + Math.sin(animPhase * 0.5) * 0.15;
      break;
    case 'flow':
      rotation = animPhase * 0.5;
      break;
    case 'ripple':
      scale = 1 + Math.sin(animPhase * 2) * 0.1;
      break;
    case 'spin-scale':
      rotation = animPhase;
      scale = 1 + Math.sin(animPhase * 2) * 0.15;
      break;
    case 'beat':
      scale = 1 + Math.sin(animPhase * 2) * 0.25;
      break;
  }
  
  ctx.scale(scale, scale);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  
  // 设置发光效果
  ctx.shadowBlur = size * 2;
  ctx.shadowColor = config.glowColor;
  ctx.fillStyle = config.color;
  ctx.strokeStyle = config.color;
  
  const s = size * config.baseSize;
  
  switch (config.shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'square':
      ctx.fillRect(-s, -s, s * 2, s * 2);
      break;
      
    case 'star':
      drawStar(ctx, 0, 0, 5, s, s * 0.4);
      ctx.fill();
      break;
      
    case 'hexagon':
      drawPolygon(ctx, 0, 0, 6, s);
      ctx.fill();
      break;
      
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s, 0);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'ring':
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.lineWidth = s * 0.3;
      ctx.stroke();
      // 内部小圆
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'cross':
      const w = s * 0.3;
      ctx.fillRect(-w, -s, w * 2, s * 2);
      ctx.fillRect(-s, -w, s * 2, w * 2);
      break;
      
    case 'heart':
      drawHeart(ctx, 0, 0, s);
      ctx.fill();
      break;
  }
  
  ctx.restore();
}

// 绘制星形
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

// 绘制多边形
function drawPolygon(ctx: CanvasRenderingContext2D, cx: number, cy: number, sides: number, radius: number) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

// 绘制心形
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x, y, x - size * 0.5, y - size * 0.5, x - size * 0.5, y);
  ctx.bezierCurveTo(x - size * 0.5, y - size * 0.8, x, y - size * 0.8, x, y - size * 0.5);
  ctx.bezierCurveTo(x, y - size * 0.8, x + size * 0.5, y - size * 0.8, x + size * 0.5, y);
  ctx.bezierCurveTo(x + size * 0.5, y - size * 0.5, x, y, x, y + size * 0.3);
  ctx.closePath();
}

export function ParticleCanvas({ particles, width, height }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布（使用半透明黑色产生拖尾效果）
    ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
    ctx.fillRect(0, 0, width, height);

    // 绘制粒子
    for (const particle of particles) {
      const config = PARTICLE_TYPE_CONFIGS[particle.type];
      drawParticleShape(
        ctx,
        particle.x,
        particle.y,
        particle.size,
        config,
        particle.animPhase,
        particle.alpha
      );
    }
  }, [particles, width, height]);

  useEffect(() => {
    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="block"
      style={{
        background: '#0a0a0f',
        imageRendering: 'pixelated',
      }}
    />
  );
}
