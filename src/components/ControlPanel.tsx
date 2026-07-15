import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SimulationParams } from '@/types/particle';

interface ControlPanelProps {
  isRunning: boolean;
  params: SimulationParams;
  fps: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onParamChange: (key: keyof SimulationParams, value: number) => void;
}

export function ControlPanel({
  isRunning,
  params,
  fps,
  onPlay,
  onPause,
  onReset,
  onParamChange,
}: ControlPanelProps) {
  return (
    <Card className="w-full max-w-sm bg-slate-900/90 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
          <Settings2 className="w-5 h-5" />
          控制面板
          <span className="text-xs text-slate-400 ml-auto">{fps} FPS</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 播放控制 */}
        <div className="flex gap-2">
          {isRunning ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onPause}
              className="flex-1 bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              <Pause className="w-4 h-4 mr-1" />
              暂停
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onPlay}
              className="flex-1 bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              <Play className="w-4 h-4 mr-1" />
              播放
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex-1 bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            重置
          </Button>
        </div>

        {/* 粒子数量 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">粒子数量</span>
            <span className="text-slate-400">{params.particleCount}</span>
          </div>
          <Slider
            value={[params.particleCount]}
            onValueChange={([v]) => onParamChange('particleCount', v)}
            min={500}
            max={5000}
            step={100}
            className="w-full"
          />
        </div>

        {/* 引力半径 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">引力半径</span>
            <span className="text-slate-400">{params.attractionRadius}</span>
          </div>
          <Slider
            value={[params.attractionRadius]}
            onValueChange={([v]) => onParamChange('attractionRadius', v)}
            min={30}
            max={150}
            step={5}
            className="w-full"
          />
        </div>

        {/* 斥力半径 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">斥力半径</span>
            <span className="text-slate-400">{params.repulsionRadius}</span>
          </div>
          <Slider
            value={[params.repulsionRadius]}
            onValueChange={([v]) => onParamChange('repulsionRadius', v)}
            min={5}
            max={50}
            step={2}
            className="w-full"
          />
        </div>

        {/* 引力强度 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">引力强度</span>
            <span className="text-slate-400">{params.attractionStrength.toFixed(2)}</span>
          </div>
          <Slider
            value={[params.attractionStrength * 100]}
            onValueChange={([v]) => onParamChange('attractionStrength', v / 100)}
            min={10}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        {/* 摩擦力 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">摩擦力</span>
            <span className="text-slate-400">{params.friction.toFixed(3)}</span>
          </div>
          <Slider
            value={[params.friction * 1000]}
            onValueChange={([v]) => onParamChange('friction', v / 1000)}
            min={950}
            max={999}
            step={1}
            className="w-full"
          />
        </div>

        {/* 最大速度 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">最大速度</span>
            <span className="text-slate-400">{params.maxSpeed.toFixed(1)}</span>
          </div>
          <Slider
            value={[params.maxSpeed * 10]}
            onValueChange={([v]) => onParamChange('maxSpeed', v / 10)}
            min={10}
            max={80}
            step={2}
            className="w-full"
          />
        </div>

        {/* 时间缩放 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">时间缩放</span>
            <span className="text-slate-400">{params.timeScale.toFixed(1)}x</span>
          </div>
          <Slider
            value={[params.timeScale * 10]}
            onValueChange={([v]) => onParamChange('timeScale', v / 10)}
            min={1}
            max={30}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
