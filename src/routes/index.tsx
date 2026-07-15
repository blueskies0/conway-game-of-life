import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { GameCanvas } from '@/components/GameCanvas';
import { GameControls } from '@/components/GameControls';
import { PatternBrowser } from '@/components/PatternBrowser';
import { useGameOfLife } from '@/hooks/useGameOfLife';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dna, Grid3X3 } from 'lucide-react';
import type { Pattern } from '@/types/gameOfLife';

export const Route = createFileRoute('/')({
  component: GameOfLife,
});

function GameOfLife() {
  const {
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
  } = useGameOfLife();

  const [activeTab, setActiveTab] = useState('controls');

  const handlePatternSelect = (pattern: Pattern) => {
    loadPatternToGrid(pattern);
    setActiveTab('controls');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* 标题栏 */}
      <header className="px-6 py-4 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Dna className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              康威生命游戏
              <span className="text-sm font-normal text-slate-400 ml-3">
                Conway's Game of Life
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              细胞自动机模拟，探索生命的演化规律
            </p>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 画布区域 */}
        <div className="flex-1 p-4 overflow-auto">
          <GameCanvas
            grid={grid}
            params={params}
            onCellClick={toggleCellAt}
          />
        </div>

        {/* 控制面板区域 */}
        <div className="w-full lg:w-[400px] p-4 bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-slate-800">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="controls" className="data-[state=active]:bg-slate-700">
                <Grid3X3 className="w-4 h-4 mr-2" />
                控制面板
              </TabsTrigger>
              <TabsTrigger value="patterns" className="data-[state=active]:bg-slate-700">
                <Dna className="w-4 h-4 mr-2" />
                模板库
              </TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="mt-4">
              <GameControls
                isRunning={isRunning}
                generation={generation}
                population={population}
                params={params}
                onPlay={play}
                onPause={pause}
                onStep={step}
                onClear={clear}
                onRandomize={() => randomize(0.3)}
                onParamsChange={updateParams}
              />
            </TabsContent>

            <TabsContent value="patterns" className="mt-4">
              <PatternBrowser onSelectPattern={handlePatternSelect} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 底部信息 */}
      <footer className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>点击网格可手动编辑细胞状态</span>
          <span>拖动鼠标可连续绘制</span>
        </div>
      </footer>
    </div>
  );
}
