import { useState, useCallback, useRef, useEffect } from 'react';
import type { Grid, GameState, GameParams, Pattern } from '@/types/gameOfLife';
import { DEFAULT_PARAMS } from '@/types/gameOfLife';

// 创建空网格
function createEmptyGrid(width: number, height: number): Grid {
  return {
    width,
    height,
    cells: Array(height).fill(null).map(() => Array(width).fill(false)),
    ages: Array(height).fill(null).map(() => Array(width).fill(0)),
  };
}

// 计算下一代
function computeNextGeneration(grid: Grid): Grid {
  const newGrid = createEmptyGrid(grid.width, grid.height);
  let population = 0;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      let neighbors = 0;

      // 计算邻居数量
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < grid.height && nx >= 0 && nx < grid.width) {
            if (grid.cells[ny][nx]) neighbors++;
          }
        }
      }

      const isAlive = grid.cells[y][x];
      let newAge = 0;

      // 康威生命游戏规则
      if (isAlive) {
        // 存活：2或3个邻居存活
        if (neighbors === 2 || neighbors === 3) {
          newGrid.cells[y][x] = true;
          newAge = Math.min(grid.ages[y][x] + 1, 255);
          population++;
        }
      } else {
        // 诞生：恰好3个邻居存活
        if (neighbors === 3) {
          newGrid.cells[y][x] = true;
          newAge = 1;
          population++;
        }
      }

      newGrid.ages[y][x] = newAge;
    }
  }

  return newGrid;
}

// 随机生成
function randomizeGrid(grid: Grid, density: number = 0.3): Grid {
  const newGrid = createEmptyGrid(grid.width, grid.height);
  let population = 0;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (Math.random() < density) {
        newGrid.cells[y][x] = true;
        newGrid.ages[y][x] = 1;
        population++;
      }
    }
  }

  return newGrid;
}

// 加载模板
function loadPattern(grid: Grid, pattern: Pattern, offsetX: number = 0, offsetY: number = 0): Grid {
  const newGrid = createEmptyGrid(grid.width, grid.height);

  // 复制原网格
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      newGrid.cells[y][x] = grid.cells[y][x];
      newGrid.ages[y][x] = grid.ages[y][x];
    }
  }

  // 添加模板
  const centerX = Math.floor((grid.width - pattern.width) / 2) + offsetX;
  const centerY = Math.floor((grid.height - pattern.height) / 2) + offsetY;

  pattern.cells.forEach(({ x, y }) => {
    const nx = centerX + x;
    const ny = centerY + y;
    if (nx >= 0 && nx < grid.width && ny >= 0 && ny < grid.height) {
      newGrid.cells[ny][nx] = true;
      newGrid.ages[ny][nx] = 1;
    }
  });

  return newGrid;
}

// 切换细胞状态
function toggleCell(grid: Grid, x: number, y: number): Grid {
  const newGrid = createEmptyGrid(grid.width, grid.height);

  for (let gy = 0; gy < grid.height; gy++) {
    for (let gx = 0; gx < grid.width; gx++) {
      newGrid.cells[gy][gx] = grid.cells[gy][gx];
      newGrid.ages[gy][gx] = grid.ages[gy][gx];
    }
  }

  if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
    newGrid.cells[y][x] = !newGrid.cells[y][x];
    newGrid.ages[y][x] = newGrid.cells[y][x] ? 1 : 0;
  }

  return newGrid;
}

// 计算人口
function countPopulation(grid: Grid): number {
  let count = 0;
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (grid.cells[y][x]) count++;
    }
  }
  return count;
}

export function useGameOfLife() {
  const [params, setParams] = useState<GameParams>(DEFAULT_PARAMS);
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(DEFAULT_PARAMS.gridWidth, DEFAULT_PARAMS.gridHeight));
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [population, setPopulation] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 更新参数
  const updateParams = useCallback((newParams: Partial<GameParams>) => {
    setParams(prev => {
      const updated = { ...prev, ...newParams };
      // 如果网格大小改变，重新创建网格
      if (newParams.gridWidth || newParams.gridHeight) {
        setGrid(createEmptyGrid(updated.gridWidth, updated.gridHeight));
        setGeneration(0);
        setPopulation(0);
      }
      return updated;
    });
  }, []);

  // 单步前进
  const step = useCallback(() => {
    setGrid(prev => {
      const next = computeNextGeneration(prev);
      return next;
    });
    setGeneration(prev => prev + 1);
    setPopulation(countPopulation(grid));
  }, [grid]);

  // 播放
  const play = useCallback(() => {
    setIsRunning(true);
  }, []);

  // 暂停
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // 清空
  const clear = useCallback(() => {
    setGrid(createEmptyGrid(params.gridWidth, params.gridHeight));
    setGeneration(0);
    setPopulation(0);
    setIsRunning(false);
  }, [params.gridWidth, params.gridHeight]);

  // 随机生成
  const randomize = useCallback((density: number = 0.3) => {
    setGrid(prev => randomizeGrid(prev, density));
    setGeneration(0);
    setPopulation(countPopulation(grid));
  }, [grid]);

  // 加载模板
  const loadPatternToGrid = useCallback((pattern: Pattern, offsetX?: number, offsetY?: number) => {
    setGrid(prev => loadPattern(prev, pattern, offsetX, offsetY));
    setGeneration(0);
    setPopulation(countPopulation(grid));
  }, [grid]);

  // 切换细胞
  const toggleCellAt = useCallback((x: number, y: number) => {
    setGrid(prev => toggleCell(prev, x, y));
    setPopulation(countPopulation(grid));
  }, [grid]);

  // 自动演化
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setGrid(prev => {
          const next = computeNextGeneration(prev);
          return next;
        });
        setGeneration(prev => prev + 1);
      }, params.speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, params.speed]);

  // 更新人口数
  useEffect(() => {
    setPopulation(countPopulation(grid));
  }, [grid]);

  return {
    grid,
    generation,
    population,
    isRunning,
    params,
    play,
    pause,
    step,
    clear,
    randomize,
    loadPatternToGrid,
    toggleCellAt,
    updateParams,
  };
}
