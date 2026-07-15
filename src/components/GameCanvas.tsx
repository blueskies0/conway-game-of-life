import { useEffect, useRef, useCallback } from 'react';
import type { Grid, GameParams } from '@/types/gameOfLife';

interface GameCanvasProps {
  grid: Grid;
  params: GameParams;
  onCellClick: (x: number, y: number) => void;
}

export function GameCanvas({ grid, params, onCellClick }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 绘制网格
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { cellSize, glowIntensity, showTrails, trailLength } = params;
    const width = grid.width * cellSize;
    const height = grid.height * cellSize;

    // 设置画布大小
    canvas.width = width;
    canvas.height = height;

    // 清空画布
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // 绘制网格线
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= grid.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, height);
      ctx.stroke();
    }
    for (let y = 0; y <= grid.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(width, y * cellSize);
      ctx.stroke();
    }

    // 绘制细胞
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (grid.cells[y][x]) {
          const age = grid.ages[y][x];
          const alpha = Math.min(age / (showTrails ? trailLength : 1), 1);

          // 发光效果
          if (glowIntensity > 0) {
            const gradient = ctx.createRadialGradient(
              x * cellSize + cellSize / 2,
              y * cellSize + cellSize / 2,
              0,
              x * cellSize + cellSize / 2,
              y * cellSize + cellSize / 2,
              cellSize * 1.5
            );
            gradient.addColorStop(0, `rgba(0, 255, 136, ${0.8 * glowIntensity * alpha})`);
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(
              x * cellSize - cellSize / 2,
              y * cellSize - cellSize / 2,
              cellSize * 2,
              cellSize * 2
            );
          }

          // 细胞本体
          const cellAlpha = 0.3 + alpha * 0.7;
          ctx.fillStyle = `rgba(0, 255, 136, ${cellAlpha})`;
          ctx.fillRect(
            x * cellSize + 1,
            y * cellSize + 1,
            cellSize - 2,
            cellSize - 2
          );
        }
      }
    }
  }, [grid, params]);

  // 动画循环
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [draw]);

  // 处理点击
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / params.cellSize);
    const y = Math.floor((e.clientY - rect.top) / params.cellSize);

    if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
      onCellClick(x, y);
    }
  }, [grid.width, grid.height, params.cellSize, onCellClick]);

  // 处理拖拽
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / params.cellSize);
    const y = Math.floor((e.clientY - rect.top) / params.cellSize);

    if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
      onCellClick(x, y);
    }
  }, [grid.width, grid.height, params.cellSize, onCellClick]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg border border-slate-800 bg-[#0a0a0f]"
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="cursor-crosshair"
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
