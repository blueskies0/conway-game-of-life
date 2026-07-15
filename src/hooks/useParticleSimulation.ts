import { useState, useRef, useCallback, useEffect } from 'react';
import type { Particle, SimulationParams, AttractionMatrix } from '@/types/particle';
import { DEFAULT_PARAMS, generateBalancedMatrix } from '@/types/particle';
import { initializeParticles, calculateForces, updateParticles, respawnDeadParticles } from '@/utils/physics';

interface SimulationState {
  particles: Particle[];
  isRunning: boolean;
  params: SimulationParams;
  matrix: AttractionMatrix;
  fps: number;
}

export function useParticleSimulation(canvasWidth: number, canvasHeight: number) {
  const [state, setState] = useState<SimulationState>({
    particles: [],
    isRunning: true,
    params: DEFAULT_PARAMS,
    matrix: generateBalancedMatrix(),
    fps: 60,
  });

  const particlesRef = useRef<Particle[]>([]);
  const isRunningRef = useRef(true);
  const paramsRef = useRef(DEFAULT_PARAMS);
  const matrixRef = useRef(generateBalancedMatrix());
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const fpsCounterRef = useRef({ frames: 0, lastTime: 0, fps: 60 });

  // 初始化粒子
  const initParticles = useCallback(() => {
    const particles = initializeParticles(paramsRef.current.particleCount, canvasWidth, canvasHeight);
    particlesRef.current = particles;
    setState(prev => ({ ...prev, particles }));
  }, [canvasWidth, canvasHeight]);

  // 模拟循环
  const simulate = useCallback((currentTime: number) => {
    if (!isRunningRef.current) {
      animationFrameRef.current = requestAnimationFrame(simulate);
      return;
    }

    const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0.016;
    lastTimeRef.current = currentTime;

    // 限制最大时间步长，防止卡顿后跳变
    const clampedDeltaTime = Math.min(deltaTime, 0.1);

    // 计算力
    calculateForces(particlesRef.current, paramsRef.current, matrixRef.current, canvasWidth, canvasHeight);

    // 更新粒子
    updateParticles(particlesRef.current, paramsRef.current, canvasWidth, canvasHeight, clampedDeltaTime);

    // 重生死亡的粒子
    respawnDeadParticles(particlesRef.current, canvasWidth, canvasHeight);

    // 计算 FPS
    fpsCounterRef.current.frames++;
    if (currentTime - fpsCounterRef.current.lastTime >= 1000) {
      fpsCounterRef.current.fps = fpsCounterRef.current.frames;
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = currentTime;
      setState(prev => ({ ...prev, fps: fpsCounterRef.current.fps }));
    }

    // 更新状态（只更新引用，不触发重渲染）
    setState(prev => ({ ...prev, particles: particlesRef.current }));

    animationFrameRef.current = requestAnimationFrame(simulate);
  }, [canvasWidth, canvasHeight]);

  // 启动模拟
  useEffect(() => {
    initParticles();
    animationFrameRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initParticles, simulate]);

  // 控制方法
  const play = useCallback(() => {
    isRunningRef.current = true;
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    isRunningRef.current = false;
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    initParticles();
  }, [initParticles]);

  const setParams = useCallback((newParams: Partial<SimulationParams>) => {
    paramsRef.current = { ...paramsRef.current, ...newParams };
    setState(prev => ({ ...prev, params: paramsRef.current }));
  }, []);

  const setMatrix = useCallback((newMatrix: AttractionMatrix) => {
    matrixRef.current = newMatrix;
    setState(prev => ({ ...prev, matrix: newMatrix }));
  }, []);

  const updateMatrixCell = useCallback((row: number, col: number, value: number) => {
    const newMatrix = matrixRef.current.map(r => [...r]);
    newMatrix[row][col] = value;
    matrixRef.current = newMatrix;
    setState(prev => ({ ...prev, matrix: newMatrix }));
  }, []);

  return {
    particles: state.particles,
    isRunning: state.isRunning,
    params: state.params,
    matrix: state.matrix,
    fps: state.fps,
    play,
    pause,
    reset,
    setParams,
    setMatrix,
    updateMatrixCell,
  };
}
